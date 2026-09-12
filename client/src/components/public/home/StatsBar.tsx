import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'motion/react';

const stats = [
    { value: 500, suffix: '+', label: 'Successful Tours' },
    { value: 10, suffix: 'k+', label: 'Happy Travelers' },
    { value: 150, suffix: '+', label: 'Local Partners' },
    { value: 4.9, suffix: '/5', label: 'Client Rating', decimals: 1 },
];

function StatItem({ stat }: { stat: typeof stats[number] }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: false, amount: 1 });
    const [display, setDisplay] = useState(`0${stat.suffix}`);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, stat.value, {
            duration: 1.5,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(`${v.toFixed(stat.decimals ?? 0)}${stat.suffix}`),
        });
        return () => controls.stop();
    }, [inView, stat]);

    return (
        <div ref={ref}>
            <div className="text-4xl font-heading font-bold mb-2">{display}</div>
            <div className="text-primary-fixed opacity-80 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
        </div>
    );
}

export default function StatsBar() {
    return (
        <section className="bg-primary py-20 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="wrapper relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((s) => <StatItem key={s.label} stat={s} />)}
            </div>
        </section>
    );
}