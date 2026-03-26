import { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { HeroCarouselPortable } from '@/components/HeroCarouselPortable';

/**
 * Carrossel estilo Macofel no topo da home; só renderiza se existirem slides ativos.
 */
const HomeHeroBanner = () => {
  const [slides, setSlides] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('lw_home_hero_slides')
          .select('id, image_url, title, subtitle, body_text, href')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (cancelled) return;

        if (error) {
          setSlides([]);
          return;
        }

        const mapped = (data || []).map((row) => ({
          id: row.id,
          image: row.image_url,
          title: row.title || undefined,
          subtitle: row.subtitle || undefined,
          text: row.body_text || undefined,
          href: row.href || undefined,
        }));

        setSlides(mapped);
      } catch {
        if (!cancelled) setSlides([]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (slides === null || slides.length === 0) return null;

  return <HeroCarouselPortable slides={slides} autoPlayInterval={5000} />;
};

export default HomeHeroBanner;
