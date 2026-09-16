import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toursApi } from '../../lib/api/tours';
import type { Tour } from '../../types/tour';

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };

type GalleryImage = { src: string; alt: string; destinationName: string };

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    toursApi
      .getAllActive()
      .then((tours: Tour[]) => {
        const imgs = tours
          .filter((t) => t.images && t.images.length > 0)
          .map((t) => ({
            src: t.images.find((i) => i.isCover)?.url || t.images[0].url,
            alt: t.title,
            destinationName: t.destination.name,
          }));
        setImages(imgs);
      })
      .catch(() => setError('Could not load the gallery right now — please try again shortly.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative h-[45vh] min-h-[320px] w-full flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000"
          alt="Northern Pakistan gallery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-6">
          <span className="label text-white/80">Moments from the Mountains</span>
          <h1 className="text-display-lg-mobile md:text-display-lg text-white mt-2">Gallery</h1>
        </div>
      </section>

      <section className="wrapper py-24">
        {loading && <p className="text-center text-text-muted">Loading gallery...</p>}
        {error && <p className="text-center text-error">{error}</p>}

        {!loading && !error && images.length === 0 && (
          <p className="text-center text-text-muted">
            No gallery images are available yet — photos will appear here once tours have images uploaded.
          </p>
        )}

        {!loading && !error && images.length > 0 && (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]"
          >
            {images.map((img, i) => (
              <motion.button
                key={`${img.src}-${i}`}
                variants={itemVariants}
                onClick={() => setLightbox(img)}
                className="mb-4 w-full block rounded-xl overflow-hidden group relative"
              >
                <img src={img.src} alt={img.alt} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-body-sm font-semibold text-left">{img.destinationName}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </section>

      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-full rounded-lg object-contain" />
        </motion.div>
      )}
    </div>
  );
}