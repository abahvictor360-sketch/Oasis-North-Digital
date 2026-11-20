import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Globe2 } from "lucide-react";
import type { HeroData, ProfileData, PortfolioItem } from "@/content/site";
import { slugify } from "@/lib/slug";
import BookButton from "@/components/BookButton";

export default function Hero({
  hero,
  profile,
  project,
  projectCount,
}: {
  hero: HeroData;
  profile: ProfileData;
  project?: PortfolioItem;
  projectCount: number;
}) {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border px-6 pb-16 pt-10 sm:px-10 sm:py-20 lg:px-12 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-accent/7 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-9 hidden flex-wrap items-center gap-3 text-xs text-muted sm:flex">
          <span className="flex items-center gap-2 rounded-full border border-border bg-bg-card px-3 py-2">
            <Globe2 className="h-3.5 w-3.5 text-accent" /> {profile.location} ·
            For businesses & individuals
          </span>
          <span>Websites. Apps. Automation.</span>
        </div>
        <div className="grid items-center gap-12 xl:grid-cols-[1.15fr_0.85fr] xl:gap-9">
          <div>
            <span className="section-eyebrow">{hero.eyebrow}</span>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.5rem] font-semibold leading-[1.12] tracking-[-0.045em] sm:text-5xl lg:text-[3.25rem] 2xl:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {hero.subtext}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton
                bookingUrl={profile.bookingUrl}
                className="inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim"
              />
              <a
                href="#portfolio"
                className="inline-flex items-center gap-3 rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
              >
                Explore the work <ArrowDown className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              A 30-minute call, by video or phone, at a time that suits you.{" "}
              <a
                href="#contact"
                className="inline-flex items-center gap-1 text-text underline-offset-4 hover:text-accent hover:underline"
              >
                Prefer to write? Send a brief
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </p>
          </div>
          {project?.image && (
            <Link
              href={`/work/${slugify(project.title)}`}
              className="group block min-w-0 overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl shadow-black/20"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-muted">
                <span>Inside the portfolio</span>
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                </span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={project.image}
                  alt={`${project.title} website preview`}
                  fill
                  sizes="(max-width: 1024px) 90vw, (max-width: 1280px) 65vw, 34vw"
                  className="object-cover object-top transition duration-700 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-xs text-muted">{project.category}</p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    {project.title}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition group-hover:border-accent group-hover:text-accent">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )}
        </div>
        <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-7 sm:mt-16">
          <div>
            <dt className="font-display text-2xl font-semibold sm:text-3xl">
              6<span className="text-accent">+</span>
            </dt>
            <dd className="mt-2 text-xs text-muted sm:text-sm">
              Years of experience
            </dd>
          </div>
          <div>
            <dt className="font-display text-2xl font-semibold sm:text-3xl">
              {projectCount}
            </dt>
            <dd className="mt-2 text-xs text-muted sm:text-sm">
              Projects to explore
            </dd>
          </div>
          <div>
            <dt className="font-display text-lg font-semibold sm:text-2xl">
              End to end
            </dt>
            <dd className="mt-2 text-xs text-muted sm:text-sm">
              From design to support
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
