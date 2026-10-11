import { ShieldCheck, BadgeCheck } from 'lucide-react';

export type FilterState = {
    priceMax: number;
    durations: string[];
    difficulties: string[];
};

interface TourFiltersProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

export default function TourFilters({ filters, onChange }: TourFiltersProps) {
    const handleDurationToggle = (range: string) => {
        const newDurations = filters.durations.includes(range)
            ? filters.durations.filter((d) => d !== range)
            : [...filters.durations, range];
        onChange({ ...filters, durations: newDurations });
    };

    const handleDifficultyToggle = (diff: string) => {
        const newDiffs = filters.difficulties.includes(diff)
            ? filters.difficulties.filter((d) => d !== diff)
            : [...filters.difficulties, diff];
        onChange({ ...filters, difficulties: newDiffs });
    };

    const handleReset = () => {
        onChange({ priceMax: 2000000, durations: [], difficulties: [] });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm sticky top-28">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 font-heading">Filters</h3>
                <button 
                    onClick={handleReset}
                    className="text-[11px] font-bold text-primary tracking-wider uppercase hover:underline"
                >
                    Reset
                </button>
            </div>

            {/* Price Range */}
            <div className="mb-10">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-6">Max Price</h4>
                <input 
                    type="range" 
                    min="100000" 
                    max="2000000" 
                    step="50000"
                    value={filters.priceMax}
                    onChange={(e) => onChange({ ...filters, priceMax: parseInt(e.target.value) })}
                    className="w-full accent-primary"
                />
                <div className="flex justify-between mt-4 text-xs font-semibold text-slate-500">
                    <span>PKR 100,000</span>
                    <span className="text-primary font-bold">PKR {filters.priceMax.toLocaleString()}</span>
                    <span>PKR 2,000,000</span>
                </div>
            </div>

            {/* Duration */}
            <div className="mb-10">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">Duration (Days)</h4>
                <div className="space-y-3">
                    {[
                        { label: '3 - 7 Days', value: '3-7' },
                        { label: '8 - 12 Days', value: '8-12' },
                        { label: '13 - 15 Days', value: '13-15' }
                    ].map((duration) => {
                        const isActive = filters.durations.includes(duration.value);
                        return (
                            <label key={duration.value} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'border-primary bg-primary text-white' : 'border-slate-300 group-hover:border-primary'}`}>
                                    {isActive && (
                                        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    )}
                                </div>
                                <span className="text-sm text-slate-700">{duration.label}</span>
                                <input type="checkbox" className="hidden" checked={isActive} onChange={() => handleDurationToggle(duration.value)} />
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Difficulty Level */}
            <div className="mb-10">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">Difficulty Level</h4>
                <div className="grid grid-cols-2 gap-2">
                    {['Easy', 'Moderate', 'Challenging', 'Extreme'].map((diff) => {
                        const isActive = filters.difficulties.includes(diff);
                        return (
                            <button 
                                key={diff}
                                onClick={() => handleDifficultyToggle(diff)}
                                className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${isActive ? 'bg-[#1a3c34] border-[#1a3c34] text-white shadow-sm' : 'border-slate-200 text-slate-700 hover:border-primary'}`}
                            >
                                {diff}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <BadgeCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800">Best Price Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800">Secure Booking</span>
                </div>
            </div>
        </div>
    );
}