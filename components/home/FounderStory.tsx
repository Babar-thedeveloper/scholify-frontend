import { CONTAINER, founder } from "./homepage.data";
import { Reveal } from "./Reveal";

/*
 * NOTE: Replace the initials avatar below with a real founder photo by adding
 * an image at `public/founder-placeholder.jpg` and swapping the placeholder
 * block for a next/image <Image> tag. We keep an initials avatar for now to
 * avoid shipping a broken image reference.
 */
export function FounderStory() {
  return (
    <section className="w-full bg-background py-20 md:py-28">
      <div className={CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-5">
          {/* Left — photo / avatar */}
          <Reveal className="lg:col-span-2">
            <div className="mx-auto max-w-xs text-center">
              <div className="rounded-3xl bg-emerald-50 p-2 ring-1 ring-emerald-200/70 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-6xl font-bold text-white">
                  B
                </div>
              </div>
              <p className="mt-4 text-lg font-semibold text-foreground">
                {founder.name}
              </p>
              <p className="text-sm text-muted-foreground">{founder.title}</p>
            </div>
          </Reveal>

          {/* Right — story */}
          <Reveal delay={120} className="lg:col-span-3">
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {founder.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              {founder.headingTop}
              <br />
              <span className="text-primary">{founder.headingAccent}</span>
            </h2>

            <div className="mt-6 space-y-4 border-l-2 border-emerald-500 pl-6">
              {founder.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed text-foreground/80 ${
                    i === 0 ? "text-lg md:text-xl" : "text-base md:text-lg"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            <p className="mt-6 italic text-muted-foreground">
              {founder.signature}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
