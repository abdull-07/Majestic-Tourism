import { motion, useScroll } from 'motion/react';

export default function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]"
            style={{ scaleX: scrollYProgress }}
        />
    );
}