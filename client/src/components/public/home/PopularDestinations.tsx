import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const reveal = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.3 },
};

export default function PopularDestinations() {
    return (
        <section className="wrapper py-24">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <span className="label text-secondary">The Best of North</span>
                    <h2 className="text-headline-md text-primary mt-2">Popular Destinations</h2>
                </div>
                <a href="/destinations" className="text-primary font-semibold flex items-center gap-2 group">
                    View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px] h-">
                <motion.div {...reveal} transition={{ duration: 0.7 }} className="md:col-span-8 group relative overflow-hidden rounded-xl shadow-md">
                    <img
                        src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1400"
                        alt="Skardu"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white text-headline-sm">Skardu, Gilgit Baltistan</h3>
                        <p className="text-white/80 text-body-sm">The Gateway to the Karakoram Giants.</p>
                    </div>
                </motion.div>

                <div className="md:col-span-4 grid grid-rows-2 gap-gutter">
                    <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.15 }} className="group relative overflow-hidden rounded-xl shadow-md">
                        <img
                            src="https://images.unsplash.com/photo-1600100397608-59749b3f2b93?q=80&w=800"
                            alt="Fairy Meadows"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-0 left-0 p-6"><h3 className="text-white font-bold text-xl">Fairy Meadows</h3></div>
                    </motion.div>
                    <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.3 }} className="group relative overflow-hidden rounded-xl shadow-md">
                        <img
                            src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800"
                            alt="Swat Valley"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-0 left-0 p-6"><h3 className="text-white font-bold text-xl">Swat Valley</h3></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}