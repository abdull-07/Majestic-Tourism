import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { TourItineraryDay } from '../../../types/tour';

export default function ItineraryAccordion({ days }: { days: TourItineraryDay[] }) {
    const [openDay, setOpenDay] = useState<string | null>(days[0]?.id ?? null);

    if (days.length === 0) {
        return <p className="text-text-muted">Itinerary details coming soon for this tour.</p>;
    }

    return (
        <div className="space-y-3">
            {days.map((day) => {
                const isOpen = openDay === day.id;
                return (
                    <div key={day.id} className="card overflow-hidden">
                        <button
                            onClick={() => setOpenDay(isOpen ? null : day.id)}
                            className="w-full flex items-center justify-between p-5 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {day.dayNumber}
                                </span>
                                <span className="font-semibold text-primary">{day.title}</span>
                            </div>
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown size={18} className="text-text-muted" />
                            </motion.div>
                        </button>
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-5 pb-5 pl-[52px] text-text-muted text-body-sm">{day.description}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}