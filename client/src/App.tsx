import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UsersList from './pages/admin/users/UsersList';

// Public pages — lazy loaded
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const DestinationsListing = lazy(() => import('./pages/public/DestinationsListing'));
const DestinationDetail = lazy(() => import('./pages/public/DestinationDetail'));
const TourListing = lazy(() => import('./pages/public/TourListing'));
const TourDetail = lazy(() => import('./pages/public/TourDetail'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Admin auth
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Admin pages — lazy loaded
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DestinationsList = lazy(() => import('./pages/admin/destinations/DestinationsList'));
const DestinationForm = lazy(() => import('./pages/admin/destinations/DestinationForm'));
const ToursList = lazy(() => import('./pages/admin/tours/ToursList'));
const TourNew = lazy(() => import('./pages/admin/tours/TourNew'));
const TourEdit = lazy(() => import('./pages/admin/tours/TourEdit'));
const BookingsList = lazy(() => import('./pages/admin/bookings/BookingsList'));
const BookingDetail = lazy(() => import('./pages/admin/bookings/BookingDetail'));
const PaymentsList = lazy(() => import('./pages/admin/payments/PaymentsList'));
const ReviewsList = lazy(() => import('./pages/admin/reviews/ReviewsList'));
const BlogList = lazy(() => import('./pages/admin/blog/BlogList'));
const BlogForm = lazy(() => import('./pages/admin/blog/BlogForm'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-body-sm text-text-muted">Loading...</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ---------- Public storefront ---------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/destinations" element={<DestinationsListing />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/tours" element={<TourListing />} />
          <Route path="/tours/:slug" element={<TourDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ---------- Admin auth (no layout, no guard) ---------- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ---------- Admin panel (protected) ---------- */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'STAFF']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="destinations" element={<DestinationsList />} />
            <Route path="destinations/new" element={<DestinationForm />} />
            <Route path="destinations/:id/edit" element={<DestinationForm />} />

            <Route path="tours" element={<ToursList />} />
            <Route path="tours/new" element={<TourNew />} />
            <Route path="tours/:id/edit" element={<TourEdit />} />

            <Route path="bookings" element={<BookingsList />} />
            <Route path="bookings/:id" element={<BookingDetail />} />

            <Route path="payments" element={<PaymentsList />} />

            <Route path="reviews" element={<ReviewsList />} />

            <Route path="blog" element={<BlogList />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/:id/edit" element={<BlogForm />} />

            <Route path="users" element={<UsersList />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}