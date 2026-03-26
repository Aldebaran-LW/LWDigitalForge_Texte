import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { HERO_LW_BUCKET, getHeroBucketPublicUrl } from '@/lib/heroBucket';
import { Loader2, Trash2, Plus, ImagePlus } from 'lucide-react';

function pathFromHeroPublicUrl(url) {
  if (!url) return null;
  const marker = `/object/public/${HERO_LW_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return url.slice(i + marker.length).split('?')[0];
}

const emptyForm = {
  image_url: '',
  title: '',
  subtitle: '',
  body_text: '',
  href: '',
  sort_order: 0,
  is_active: true,
};

const AdminHeroHome = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lw_home_hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar slides',
        description: error.message,
      });
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `slides/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage
        .from(HERO_LW_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (upErr) {
        toast({
          variant: 'destructive',
          title: 'Upload falhou',
          description: upErr.message,
        });
        return;
      }

      const url = getHeroBucketPublicUrl(path);
      setForm((f) => ({ ...f, image_url: url }));
      toast({ title: 'Imagem enviada', description: 'URL preenchida automaticamente.' });
    } finally {
      setUploading(false);
    }
  };

  const addSlide = async (e) => {
    e.preventDefault();
    if (!form.image_url?.trim()) {
      toast({ variant: 'destructive', title: 'Imagem obrigatória', description: 'Envie um ficheiro ou cole a URL pública.' });
      return;
    }

    setSaving(true);
    const payload = {
      image_url: form.image_url.trim(),
      title: form.title?.trim() || null,
      subtitle: form.subtitle?.trim() || null,
      body_text: form.body_text?.trim() || null,
      href: form.href?.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: !!form.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('lw_home_hero_slides').insert(payload);

    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao criar slide', description: error.message });
    } else {
      toast({ title: 'Slide criado' });
      setForm(emptyForm);
      load();
    }
    setSaving(false);
  };

  const removeSlide = async (row) => {
    if (!window.confirm('Remover este slide da home?')) return;

    const storagePath = pathFromHeroPublicUrl(row.image_url);
    if (storagePath) {
      await supabase.storage.from(HERO_LW_BUCKET).remove([storagePath]);
    }

    const { error } = await supabase.from('lw_home_hero_slides').delete().eq('id', row.id);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover',
        description: error.message,
      });
    } else {
      toast({ title: 'Slide removido' });
      load();
    }
  };

  const patchSlide = async (row, partial) => {
    const { error } = await supabase
      .from('lw_home_hero_slides')
      .update({ ...partial, updated_at: new Date().toISOString() })
      .eq('id', row.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao atualizar', description: error.message });
    } else {
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Banners da Home - Admin LWDigitalForge</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Carrossel da Home
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">
        Mesmo estilo de carrossel do Macofel (imagens + texto + CTA). Ficheiros no bucket{' '}
        <strong>{HERO_LW_BUCKET}</strong>. Aplique a migration SQL no Supabase se a tabela ainda não existir.
      </p>

      <motion.form
        onSubmit={addSlide}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-white/10 mb-10 space-y-4"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Novo slide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Upload (bucket {HERO_LW_BUCKET})</Label>
            <div className="mt-1 flex items-center gap-2">
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 text-sm">
                <ImagePlus className="w-4 h-4" />
                Escolher imagem
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
              </label>
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          </div>
          <div>
            <Label htmlFor="image_url">URL pública da imagem *</Label>
            <Input
              id="image_url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://.../Hero-LW_Digital_Forge/slides/..."
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input id="subtitle" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="body_text">Texto</Label>
          <textarea
            id="body_text"
            value={form.body_text}
            onChange={(e) => setForm((f) => ({ ...f, body_text: e.target.value }))}
            rows={2}
            className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="href">Link CTA (interno ou https://)</Label>
            <Input id="href" value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} placeholder="/produtos" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="sort_order">Ordem</Label>
            <Input
              id="sort_order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
          />
          Ativo (visível no site)
        </label>

        <Button type="submit" className="btn-primary" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Adicionar slide'}
        </Button>
      </motion.form>

      <h2 className="text-lg font-semibold mb-4">Slides atuais ({rows.length})</h2>
      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum slide. Crie o primeiro acima.</p>
        )}
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap gap-4 items-start p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/40"
          >
            <img src={row.image_url} alt="" className="w-40 h-24 object-cover rounded-lg bg-gray-100" />
            <div className="flex-1 min-w-[200px] space-y-2 text-sm">
              <div className="font-medium">{row.title || '(sem título)'}</div>
              <div className="text-gray-500 dark:text-gray-400 line-clamp-2">{row.subtitle}</div>
              <div className="flex flex-wrap gap-2 items-center">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={row.is_active}
                    onChange={(e) => patchSlide(row, { is_active: e.target.checked })}
                  />
                  Ativo
                </label>
                <label className="flex items-center gap-1 text-xs">
                  Ordem
                  <input
                    type="number"
                    className="w-16 px-1 py-0.5 rounded border bg-transparent"
                    defaultValue={row.sort_order}
                    onBlur={(e) => patchSlide(row, { sort_order: Number(e.target.value) || 0 })}
                  />
                </label>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" className="text-red-600" onClick={() => removeSlide(row)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminHeroHome;
