import api from '../api';
import type { AdminTour, TourFormValues, AdminTourImage, AdminTourItineraryDay, AdminTourAvailability } from '../../types/admin-tour';

export const adminToursApi = {
    getAll: () => api.get<AdminTour[]>('/admin/tours').then((r) => r.data),
    getOne: (id: string) => api.get<AdminTour>(`/admin/tours/${id}`).then((r) => r.data),
    create: (data: TourFormValues) => api.post<AdminTour>('/admin/tours', data).then((r) => r.data),
    update: (id: string, data: Partial<TourFormValues>) =>
        api.patch<AdminTour>(`/admin/tours/${id}`, data).then((r) => r.data),
    remove: (id: string) => api.delete(`/admin/tours/${id}`),

    addImage: (tourId: string, url: string, publicId: string, isCover?: boolean) =>
        api.post<AdminTourImage>(`/admin/tours/${tourId}/images`, { url, publicId, isCover }).then((r) => r.data),
    setCoverImage: (imageId: string) => api.patch(`/admin/tours/images/${imageId}/cover`),
    removeImage: (imageId: string) => api.delete(`/admin/tours/images/${imageId}`),

    addItineraryDay: (tourId: string, data: { dayNumber: number; title: string; description: string }) =>
        api.post<AdminTourItineraryDay>(`/admin/tours/${tourId}/itinerary`, data).then((r) => r.data),
    updateItineraryDay: (itineraryId: string, data: { dayNumber: number; title: string; description: string }) =>
        api.patch<AdminTourItineraryDay>(`/admin/tours/itinerary/${itineraryId}`, data).then((r) => r.data),
    removeItineraryDay: (itineraryId: string) => api.delete(`/admin/tours/itinerary/${itineraryId}`),

    addAvailability: (tourId: string, data: { departureDate: string; totalSeats: number }) =>
        api.post<AdminTourAvailability>(`/admin/tours/${tourId}/availability`, data).then((r) => r.data),
    updateAvailability: (availabilityId: string, data: { departureDate: string; totalSeats: number }) =>
        api.patch<AdminTourAvailability>(`/admin/tours/availability/${availabilityId}`, data).then((r) => r.data),
    removeAvailability: (availabilityId: string) => api.delete(`/admin/tours/availability/${availabilityId}`),
};