import { CONTAINER, impactStats, impactFootnote } from "./homepage.data";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

export function ImpactBar() {
  return (
    <section className="sheen w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 py-12 text-white">
      <div className={`${CONTAINER} relative z-10`}>
        <div className="grid grid-cols-2 divide-white/15 md:grid-cols-4 md:divide-x">
          {impactStats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 90}
              className="px-6 py-4 text-center transition-colors"
            >
              <div className="text-3xl font-bold tracking-tight md:text-4xl">
                <CountUp value={stat.value} />
              </div>
              <div className="mt-1.5 text-xs font-medium text-emerald-50 md:text-sm">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-sm italic text-emerald-100">
          {impactFootnote}
        </p>
      </div>
    </section>
  );
}
