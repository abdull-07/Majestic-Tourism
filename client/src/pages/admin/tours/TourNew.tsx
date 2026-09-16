import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TourDetailsForm from './TourDetailsForm';

export default function TourNew() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl">
            <button onClick={() => navigate('/admin/tours')} className="flex items-center gap-1 text-body-sm text-text-muted hover:text-primary mb-4">
                <ArrowLeft size={14} /> Back to Tours
            </button>
            <h1 className="text-headline-sm text-primary mb-6">Add Tour</h1>
            <TourDetailsForm />
        </div>
    );
}