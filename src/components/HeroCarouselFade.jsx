import { useState, useEffect } from 'react';

/**
 * @typedef {Object} HeroFadeSlide
 * @property {string} id
 * @property {string} image
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [text]
 */

/**
 * @param {Object} props
 * @param {HeroFadeSlide[]} props.slides
 * @param {number} [props.autoPlayInterval]
 */
export function HeroCarouselFade({
  slides,
  autoPlayInterval = 5000,
}) {
  const first = slides[0]?.image ?? '';
  const [index, setIndex] = useState(0);
  const [layer, setLayer] = useState(/** @type {0 | 1} */ (0));
  const [urls, setUrls] = useState(/** @type {[string, string]} */ ([first, first]));

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      autoPlayInterval
    );
    return () => clearInterval(t);
  }, [slides.length, autoPlayInterval]);

  useEffect(() => {
    const next = slides[index]?.image ?? '';
    setLayer((L) => {
      const inactive = L === 0 ? 1 : 0;
      setUrls((u) => {
        const copy = /** @type {[string, string]} */ ([...u]);
        copy[inactive] = next;
        return copy;
      });
      return inactive;
    });
  }, [index, slides]);

  if (slides.length === 0) return null;

  const active = slides[index];
  const opacity = (i) => (layer === i ? 'opacity-100' : 'opacity-0');

  return (
    <section className="relative h-[400px] w-full overflow-hidden">
      <img
        src={urls[0]}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${opacity(0)}`}
        aria-hidden={layer !== 0}
      />
      <img
        src={urls[1]}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${opacity(1)}`}
        aria-hidden={layer !== 1}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="relative z-10 flex h-full items-center px-8 text-white">
        <div key={active?.id} className="animate-in fade-in-0 duration-500">
          {active?.subtitle && (
            <p className="mb-2 text-sm font-bold uppercase text-yellow-300">
              {active.subtitle}
            </p>
          )}
          {active?.title && (
            <h1 className="text-5xl font-black">{active.title}</h1>
          )}
          {active?.text && (
            <p className="mt-4 max-w-xl text-lg text-white/90">{active.text}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroCarouselFade;
