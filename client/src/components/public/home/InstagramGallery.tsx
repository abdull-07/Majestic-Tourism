import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export type GalleryImage = {
  id?: string | number;
  src: string;
  alt: string;
};

const fallbackImages: GalleryImage[] = [
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=700', alt: 'Peak ridges at dawn' },
  { src: 'https://images.unsplash.com/photo-1476611317561-60117649dd94?q=80&w=700', alt: 'Milky Way over mountains' },
  { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=700', alt: 'Glacial turquoise river' },
  { src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=700', alt: 'Mountain bike at sunset' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=700', alt: 'Peak ridges at dawn' },
  { src: 'https://images.unsplash.com/photo-1476611317561-60117649dd94?q=80&w=700', alt: 'Milky Way over mountains' },
  { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=700', alt: 'Glacial turquoise river' },
  { src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=700', alt: 'Mountain bike at sunset' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=700', alt: 'Peak ridges at dawn' },
  { src: 'https://images.unsplash.com/photo-1476611317561-60117649dd94?q=80&w=700', alt: 'Milky Way over mountains' },
  { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=700', alt: 'Glacial turquoise river' },
  { src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=700', alt: 'Mountain bike at sunset' },
];

export default function InstagramGallery({ images = fallbackImages }: { images?: GalleryImage[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) return;

    const updateScrollDistance = () => {
      setMaxScroll(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    updateScrollDistance();
    const resizeObserver = new ResizeObserver(updateScrollDistance);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [images]);

  return (
    <section ref={sectionRef} className="relative h-[250vh]">
      <div ref={viewportRef} className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-12">
        <div className="text-center mb-12 px-6">
          <h2 className="text-headline-md text-primary">#MajesticTourismAdventures</h2>
          <p className="text-text-muted mt-2">Tag us to be featured in our mountain gallery</p>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 px-6">
          {images.map((img, index) => (
            <div key={img.id ?? `${img.src}-${index}`} className="rounded-xl overflow-hidden w-90 h-115 shrink-0">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}