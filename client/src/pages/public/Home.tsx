import Hero from '../../components/public/home/Hero';
import PopularDestinations from '../../components/public/home/PopularDestinations';
import WhyTravelWithUs from '../../components/public/home/WhyTravelWithUs';
import FeaturedTours from '../../components/public/home/FeaturedTours';
import StatsBar from '../../components/public/home/StatsBar';
import Testimonials from '../../components/public/home/Testimonials';
import InstagramGallery from '../../components/public/home/InstagramGallery';
import CTASection from '../../components/public/home/CTASection';

export default function Home() {
    return (
        <div>
            <Hero />
            <PopularDestinations />
            <WhyTravelWithUs />
            <FeaturedTours />
            <StatsBar />
            <Testimonials />
            <InstagramGallery />
            <CTASection />
        </div>
    );
}