import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Carrossel para imagens de produto.
 * @param {Object} props
 * @param {string[]} props.images
 * @param {string} [props.alt]
 * @param {number} [props.autoPlayInterval]
 * @param {'macofel' | 'cover'} [props.variant] - macofel: estilo página produto Macofel 3.1 (contain + padding)
 */
export function ProductHeroCarousel({
  images,
  alt = 'Imagem do produto',
  autoPlayInterval = 5000,
  variant = 'macofel',
}) {
  const isMacofel = variant === 'macofel';
  const reducedMotion = useReducedMotion();
  const list = useMemo(() => [...new Set((images || []).filter(Boolean))], [images]);
  const listKey = useMemo(() => list.join('|'), [list]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    setCurrentIndex(0);
  }, [listKey]);

  useEffect(() => {
    if (reducedMotion) return;
    if (!isAutoPlaying || list.length <= 1) return;
    const id = setInterval(
      () => setCurrentIndex((i) => (i + 1) % list.length),
      autoPlayInterval
    );
    return () => clearInterval(id);
  }, [isAutoPlaying, list.length, autoPlayInterval, reducedMotion]);

  const goTo = (index) => {
    if (list.length <= 1) return;
    setCurrentIndex(index);
    if (reducedMotion) return;
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (list.length === 0) return null;
  const src = list[currentIndex];

  const imgClassName = isMacofel
    ? 'relative z-0 mx-auto block h-auto w-full max-h-[min(85vh,960px)] object-contain object-center px-4 py-5 sm:px-7 sm:py-7 md:px-9 md:py-9'
    : 'absolute inset-0 h-full min-h-[280px] w-full object-cover object-center';

  const navBtnClass = isMacofel
    ? 'absolute top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-md backdrop-blur-sm transition-all hover:bg-slate-50 dark:border-white/15 dark:bg-slate-800/95 dark:text-slate-200 dark:hover:bg-slate-800'
    : 'absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 sm:p-3';

  const dotActive = isMacofel ? 'w-6 bg-slate-900 dark:bg-white sm:w-8' : 'w-6 bg-white sm:w-8';
  const dotIdle = isMacofel
    ? 'w-1.5 bg-slate-300 hover:bg-slate-400 sm:w-2 dark:bg-white/40 dark:hover:bg-white/60'
    : 'w-1.5 bg-white/50 hover:bg-white/75 sm:w-2';

  return (
    <div
      className={`relative w-full overflow-hidden ${isMacofel ? '' : 'min-h-[280px]'}`}
    >
      <img src={src} alt={alt} className={imgClassName} />

      {list.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={() => goTo((currentIndex - 1 + list.length) % list.length)}
            className={`${navBtnClass} left-2 sm:left-4`}
          >
            {isMacofel ? <ChevronLeft className="h-5 w-5" /> : '‹'}
          </button>
          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={() => goTo((currentIndex + 1) % list.length)}
            className={`${navBtnClass} right-2 sm:right-4`}
          >
            {isMacofel ? <ChevronRight className="h-5 w-5" /> : '›'}
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-5 sm:gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para imagem ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all sm:h-2 ${i === currentIndex ? dotActive : dotIdle}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductHeroCarousel;
