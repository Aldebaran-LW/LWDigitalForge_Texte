import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * @typedef {Object} HeroSlide
 * @property {string} id
 * @property {string} image
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [text]
 * @property {string} [href]
 */

/**
 * @param {Object} props
 * @param {HeroSlide[]} props.slides
 * @param {number} [props.autoPlayInterval]
 */
export function HeroCarouselPortable({
  slides,
  autoPlayInterval = 5000,
  embedded = false,
  variant = 'standalone',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const id = setInterval(
      () => setCurrentIndex((i) => (i + 1) % slides.length),
      autoPlayInterval
    );
    return () => clearInterval(id);
  }, [isAutoPlaying, slides.length, autoPlayInterval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (slides.length === 0) return null;

  const s = slides[currentIndex];
  const hasLink = !!s.href?.trim();
  const external = hasLink && /^https?:\/\//i.test(s.href);

  const ctaClassName =
    'mt-4 inline-flex rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:mt-6 sm:px-5 sm:py-2.5 sm:text-base';

  return (
    <section className={embedded ? 'w-full' : 'relative w-full overflow-hidden'}>
      <div
        className={
          variant === 'split'
            ? 'relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-slate-900/40 dark:shadow-[0_35px_90px_-45px_rgba(0,0,0,0.55)]'
            : 'relative h-[250px] w-full sm:h-[300px] md:h-[400px] lg:h-[500px]'
        }
      >
        {variant === 'split' ? (
          <>
            <img
              src={s.image}
              alt={s.title || 'Banner'}
              className="relative z-0 mx-auto block h-auto w-full max-h-[min(85vh,920px)] object-contain object-center"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] rounded-3xl bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
          </>
        ) : (
          <>
            <img
              src={s.image}
              alt={s.title || 'Banner'}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </>
        )}

        {variant !== 'split' && (
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
            <div className="max-w-full text-white">
              {s.subtitle && (
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-yellow-300 sm:mb-2 sm:text-sm md:text-base">
                  {s.subtitle}
                </p>
              )}
              {s.title && (
                <h1 className="mb-2 text-2xl font-black leading-tight tracking-tight sm:mb-4 sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl">
                  {s.title}
                </h1>
              )}
              {s.text && (
                <p className="max-w-2xl text-sm leading-snug text-white/90 sm:text-base md:text-lg lg:text-xl">
                  {s.text}
                </p>
              )}
              {hasLink &&
                (external ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ctaClassName}
                  >
                    Saiba mais
                  </a>
                ) : (
                  <Link to={s.href.trim()} className={ctaClassName}>
                    Saiba mais
                  </Link>
                ))}
            </div>
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Slide anterior"
              onClick={() =>
                goToSlide((currentIndex - 1 + slides.length) % slides.length)
              }
              className={
                variant === 'split'
                  ? 'absolute left-3 top-1/2 z-[2] -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-md backdrop-blur-sm transition-all hover:bg-white/25 sm:left-4'
                  : 'absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 sm:left-4 sm:p-3'
              }
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Próximo slide"
              onClick={() => goToSlide((currentIndex + 1) % slides.length)}
              className={
                variant === 'split'
                  ? 'absolute right-3 top-1/2 z-[2] -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-md backdrop-blur-sm transition-all hover:bg-white/25 sm:right-4'
                  : 'absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 sm:right-4 sm:p-3'
              }
            >
              ›
            </button>
            <div
              className={`absolute left-1/2 z-[2] flex -translate-x-1/2 gap-1.5 sm:gap-2 ${
                variant === 'split' ? 'bottom-3 sm:bottom-4' : 'bottom-2 sm:bottom-4'
              }`}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir para slide ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  className={`h-1.5 rounded-full transition-all sm:h-2 ${
                    i === currentIndex
                      ? 'w-6 bg-white sm:w-8'
                      : 'w-1.5 bg-white/55 hover:bg-white/80 sm:w-2'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HeroCarouselPortable;
