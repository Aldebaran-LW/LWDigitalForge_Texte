import { useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Crossfade entre imagens (padrão tipo HeroCarouselFade) para thumbnails em cards.
 * @param {Object} props
 * @param {string[]} props.images URLs únicas
 * @param {string} [props.alt]
 * @param {number} [props.interval]
 * @param {string} [props.imgClassName] classes aplicadas a cada camada (ex: object-cover, hover scale)
 */
export function ImageCrossfade({
  images,
  alt = '',
  interval = 4500,
  imgClassName = '',
}) {
  const urlKey = JSON.stringify((images || []).filter(Boolean));
  const list = useMemo(() => [...new Set(JSON.parse(urlKey || '[]'))], [urlKey]);
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [layer, setLayer] = useState(0);
  const first = list[0] ?? '';
  const [urls, setUrls] = useState([first, first]);

  useEffect(() => {
    if (list.length <= 1 || reducedMotion) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % list.length),
      interval
    );
    return () => clearInterval(t);
  }, [list.length, interval, reducedMotion]);

  useEffect(() => {
    if (list.length === 0) return;
    const next = list[index] ?? list[0];
    setLayer((L) => {
      const inactive = L === 0 ? 1 : 0;
      setUrls((u) => {
        const copy = [...u];
        copy[inactive] = next;
        return copy;
      });
      return inactive;
    });
  }, [index, list]);

  if (list.length === 0) return null;

  if (list.length === 1 || reducedMotion) {
    return (
      <img
        src={list[0]}
        alt={alt}
        className={imgClassName}
      />
    );
  }

  const opacity = (i) => (layer === i ? 'opacity-100' : 'opacity-0');
  const base =
    'absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out';

  return (
    <div className="absolute inset-0 overflow-hidden" role="img" aria-label={alt}>
      <img
        src={urls[0]}
        alt=""
        aria-hidden={layer !== 0}
        className={`${base} ${opacity(0)} ${imgClassName}`}
      />
      <img
        src={urls[1]}
        alt=""
        aria-hidden={layer !== 1}
        className={`${base} ${opacity(1)} ${imgClassName}`}
      />
    </div>
  );
}

export default ImageCrossfade;
