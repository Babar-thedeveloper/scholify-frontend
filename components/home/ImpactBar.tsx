import { CONTAINER, impactStats, impactFootnote } from "./homepage.data";
import { Reveal } from "./Reveal";

export function ImpactBar() {
  return (
    <section className="w-full bg-emerald-600 py-12 text-white">
      <div className={CONTAINER}>
        <Reveal>
          <div className="grid grid-cols-2 divide-white/20 md:grid-cols-4 md:divide-x">
            {impactStats.map((stat) => (
              <div key={stat.label} className="px-6 py-4 text-center">
                <div className="text-3xl font-bold md:text-4xl">{stat.value}</div>
                <div className="mt-1.5 text-xs font-medium text-emerald-50 md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm italic text-emerald-100">
            {impactFootnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
