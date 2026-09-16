import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminToursApi } from '../../../lib/api/admin-tours';
import TourDetailsForm from './TourDetailsForm';
import TourImagesTab from './TourImagesTab';
import TourItineraryTab from './TourItineraryTab';
import TourAvailabilityTab from './TourAvailabilityTab';
import type { AdminTour } from '../../../types/admin-tour';

const tabs = ['Details', 'Images', 'Itinerary', 'Availability'] as const;

export default function TourEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tour, setTour] = useState<AdminTour | null>(null);
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Details');

    const load = () => {
        if (!id) return;
        adminToursApi.getOne(id).then(setTour);
    };

    useEffect(load, [id]);

    if (!tour) return <p className="text-body-sm text-text-muted">Loading...</p>;

    return (
        <div className="max-w-4xl">
            <button onClick={() => navigate('/admin/tours')} className="flex items-center gap-1 text-body-sm text-text-muted hover:text-primary mb-4">
                <ArrowLeft size={14} /> Back to Tours
            </button>
            <h1 className="text-headline-sm text-primary mb-6">{tour.title}</h1>

            <div className="flex gap-2 mb-6 border-b border-mountain-mist">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-body-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-muted'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Details' && (
                <TourDetailsForm tourId={tour.id} initialValues={tour} onSaved={load} />
            )}
            {activeTab === 'Images' && (
                <TourImagesTab tourId={tour.id} images={tour.images} onChange={load} />
            )}
            {activeTab === 'Itinerary' && (
                <TourItineraryTab tourId={tour.id} days={tour.itinerary} onChange={load} />
            )}
            {activeTab === 'Availability' && (
                <TourAvailabilityTab tourId={tour.id} slots={tour.availability} onChange={load} />
            )}
        </div>
    );
}