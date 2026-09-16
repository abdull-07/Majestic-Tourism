const categories = [
    { value: '', label: 'All' },
    { value: 'ADVENTURE', label: 'Adventure' },
    { value: 'LUXURY', label: 'Luxury' },
    { value: 'FAMILY', label: 'Family' },
    { value: 'HONEYMOON', label: 'Honeymoon' },
    { value: 'GROUP', label: 'Group' },
    { value: 'BUDGET', label: 'Budget' },
];

type Props = {
    destinations: { id: string; name: string }[];
    selectedDestination: string;
    selectedCategory: string;
    onDestinationChange: (id: string) => void;
    onCategoryChange: (category: string) => void;
};

export default function TourFilters({
    destinations, selectedDestination, selectedCategory, onDestinationChange, onCategoryChange,
}: Props) {
    return (
        <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-12">
            <select
                value={selectedDestination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="flex-1 bg-transparent border border-mountain-mist rounded-lg px-4 py-2 text-body-md"
            >
                <option value="">All Destinations</option>
                {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>

            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => onCategoryChange(cat.value)}
                        className={`px-4 py-1.5 rounded-full label transition-colors ${selectedCategory === cat.value ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
}