import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search } from 'lucide-react';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section ref={sectionRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 top-[10%] h-[120%]">
        <img
          src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2000"
          alt="Hunza Valley"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-display-lg-mobile md:text-display-lg text-white mb-6 drop-shadow-lg"
        >
          Explore the Majestic <br /> Peaks of Pakistan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="text-white/90 text-body-lg max-w-2xl mx-auto mb-10 font-medium"
        >
          Experience unparalleled luxury amidst the world's most dramatic landscapes.
          From Skardu's cold deserts to Hunza's emerald valleys.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="max-w-4xl mx-auto glass-panel p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-start px-4 border-b md:border-b-0 md:border-r border-mountain-mist/30 py-2">
              <label className="label text-primary mb-1">Destination</label>
              <select className="bg-transparent border-none focus:ring-0 text-on-surface font-semibold w-full p-0">
                <option>Skardu Valley</option>
                <option>Hunza Valley</option>
                <option>Swat Valley</option>
                <option>Fairy Meadows</option>
              </select>
            </div>
            <div className="flex flex-col items-start px-4 border-b md:border-b-0 md:border-r border-mountain-mist/30 py-2">
              <label className="label text-primary mb-1">Date</label>
              <input type="date" className="bg-transparent border-none focus:ring-0 text-on-surface font-semibold w-full p-0" />
            </div>
            <div className="flex flex-col items-start px-4 py-2">
              <label className="label text-primary mb-1">Group Size</label>
              <select className="bg-transparent border-none focus:ring-0 text-on-surface font-semibold w-full p-0">
                <option>2 People</option>
                <option>4-6 People</option>
                <option>10+ People</option>
              </select>
            </div>
          </div>
          <button className="bg-primary text-white h-14 w-full md:w-40 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shrink-0">
            <Search size={18} />
            Find Tours
          </button>
        </motion.div>
      </div>
    </section>
  );
}