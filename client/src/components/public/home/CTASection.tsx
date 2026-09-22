export default function CTASection() {
    return (
        <section className="wrapper py-24">
            <div className="max-w-container-max mx-auto bg-primary rounded-3xl p-12 md:p-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600"
                        alt="Snowy mountain range"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10">
                    <h2 className="text-display-lg-mobile md:text-display-lg text-white mb-8">Start Your Adventure Today</h2>
                    <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
                        Join our next expedition and discover the untouched beauty of Pakistan's
                        northern frontiers with the experts.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-fixed transition-all">Book Your Trip</button>
                        <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">Contact Expert</button>
                    </div>
                </div>
            </div>
        </section>
    );
}