import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-24 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md"
            >
                <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center text-primary mx-auto mb-8">
                    <Compass size={36} />
                </div>

                <span className="label text-secondary">Error 404</span>
                <h1 className="text-headline-md text-primary mt-2 mb-4">
                    Looks Like You've Wandered Off the Trail
                </h1>
                <p className="text-text-muted text-body-md mb-10">
                    The page you're looking for doesn't exist — it may have been moved, or the
                    route you followed was mistyped.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-container transition-colors"
                >
                    <Home size={18} />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}