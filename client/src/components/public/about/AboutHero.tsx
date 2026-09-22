export default function AboutHero() {
    return (
        <section className="relative h-[60vh] min-h-[520px] w-full flex items-center justify-center overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?q=80&w=2000"
                alt="Karakoram range"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 text-center px-6">
                <span className="label text-white/80 text-xl">Our Story</span>
                <h1 className="text-display-lg-mobile md:text-display-lg text-white mt-2">
                    Built by People Who Love These Mountains
                </h1>
            </div>
        </section>
    );
}