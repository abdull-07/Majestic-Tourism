import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="wrapper">
                <div className="text-center mb-16">
                    <span className="label text-secondary">Voices of Majestic Tourism</span>
                    <h2 className="text-headline-md text-primary mt-2">What Our Travelers Say</h2>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 1 }}
                    className="relative max-w-4xl mx-auto"
                >
                    <div className="bg-surface rounded-2xl p-12 text-center relative">
                        <Quote className="text-primary/10 absolute -top-4 left-4" size={96} />
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
                            alt="Mark J."
                            className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-white shadow-md object-cover"
                        />
                        <p className="text-body-lg italic mb-8">
                            "The expedition to K2 Base Camp was beyond my wildest dreams. The attention to
                            detail and level of safety provided by Majestic Tourism was impeccable. Highly
                            recommended for anyone seeking true adventure."
                        </p>
                        <div className="font-bold text-primary">Mark Jenkins</div>
                        <div className="text-text-muted text-sm">Professional Mountaineer</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}