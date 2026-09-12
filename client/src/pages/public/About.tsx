import AboutHero from '../../components/public/about/AboutHero';
import OurStory from '../../components/public/about/OurStory';
import OurValues from '../../components/public/about/OurValues';
import TeamSection from '../../components/public/about/TeamSection';
import CTASection from '../../components/public/home/CTASection';
import ScrollProgressBar from '../../components/public/ScrollProgressBar';

export default function About() {
    return (
        <div>
            <ScrollProgressBar />
            <AboutHero />
            <OurStory />
            <OurValues />
            <TeamSection />
            <CTASection />
        </div>
    );
}