import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import type { Tour } from '../../../types/tour';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800';

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TourCard({ tour }: { tour: Tour }) {
    const cover = tour.images?.find((i) => i.isCover)?.url || tour.images?.[0]?.url || FALLBACK_IMG;
    const difficulty = (tour as any).difficultyLevel || 'MODERATE'; // Using any since difficultyLevel is in TourDetail
    const reviews = (tour as any).reviews || []; // Mocking reviews count
    const rating = reviews.length > 0 ? (reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) : '4.9';
    const reviewCount = reviews.length > 0 ? reviews.length : Math.floor(Math.random() * 200) + 10;

    return (
        <motion.div variants={cardVariants} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="relative h-64 overflow-hidden">
                <img src={cover} alt={tour.title} className="w-full h-full object-cover" />
                
                {/* Badges Top Left */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {tour.durationDays} DAYS
                    </span>
                    <span className="bg-[#1a3c34] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {difficulty}
                    </span>
                </div>

                {/* Compare Checkbox Top Right */}
                <div className="absolute top-4 right-4">
                    <label className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full cursor-pointer transition-colors">
                        <div className="w-4 h-4 border border-white/50 rounded flex items-center justify-center">
                            {/* Checkmark icon could go here if checked */}
                        </div>
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">Compare</span>
                    </label>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 font-heading max-w-[70%]">{tour.title}</h3>
                    <div className="text-right">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">FROM</span>
                        <span className="text-xl font-bold text-slate-900">PKR {Number(tour.basePrice).toLocaleString()}</span>
                    </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
                    {tour.description || "Experience a majestic expedition through the heart of the mountains. A luxury journey crafted for the most discerning travelers."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                        <span className="font-bold text-orange-500 text-sm">{rating}</span>
                        <span className="text-slate-500 text-sm">({reviewCount} reviews)</span>
                    </div>
                    <Link to={`/tours/${tour.slug}`} className="bg-[#1a3c34] hover:bg-[#132d27] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm">
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}