import { motion } from 'motion/react';

export default function OurStory() {
    return (
        <section className="wrapper py-24 grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7 }}
            >
                <span className="label text-secondary">Since 2016</span>
                <h2 className="text-headline-md text-primary mt-2 mb-6">
                    Ten Years Guiding Travelers Through Pakistan's North
                </h2>
                <p className="text-text-muted text-body-md mb-4">
                    Majestic Tourism started with a single jeep and a handful of trusted local guides
                    in Hunza. What began as word-of-mouth trekking trips has grown into a full expedition
                    company — without losing the thing that made it work in the first place: real
                    relationships with the communities who call these valleys home.
                </p>
                <p className="text-text-muted text-body-md">
                    Every itinerary is built by people who've walked the route themselves, and every
                    local partner — from the guesthouse owners to the high-altitude porters — is someone
                    we've worked with for years, not a name in a directory.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className="rounded-xl overflow-hidden shadow-md h-[420px]"
            >
                <img
                    src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200"
                    alt="Guide leading a trek"
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </section>
    );
}