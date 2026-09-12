import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import TourListing from './pages/public/TourListing';
import DestinationsListing from './pages/public/DestinationsListing';
import TourDetail from './pages/public/TourDetail';
import DestinationDetail from './pages/public/DestinationDetail';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tours" element={<TourListing />} />
        <Route path="/tours/:slug" element={<TourDetail />} />
        <Route path="/destinations" element={<DestinationsListing /> } />
        <Route path="/destinations/:slug" element={<DestinationDetail />} /> 
      </Route>
    </Routes>
  );
}