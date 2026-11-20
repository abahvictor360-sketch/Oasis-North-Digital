import Link from "next/link";
import { SERVICE_PAGES, type Service } from "@/content/site";
import { ServiceIcon } from "@/components/icons";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";

const SERVICE_ORDER = [
  "Website Development",
  "App Development",
  "Business Automation & AI",
  "Support & Hosting",
];
const rank = (title: string) => {
  const position = SERVICE_ORDER.indexOf(title);
  return position < 0 ? SERVICE_ORDER.length : position;
};

export default function Services({
  services: SERVICES,
}: {
  services: Service[];
}) {
  return (
    <Section
      id="services"
      eyebrow="WHAT WE DO"
      title="Websites, apps and automation, built to grow with you."
    >
      <p className="mb-9 max-w-2xl text-base leading-relaxed text-muted">
        Whether you&apos;re a business or an individual, and need a stronger first
        impression, a better way to work or fewer hours lost to manual tasks, we
        start with the job the technology needs to do.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {[...SERVICES]
          .sort((a, b) => rank(a.title) - rank(b.title))
          .map((s, i) => {
            // Services are admin-editable, so a card only links out when its
            // title still matches a service page.
            const page = SERVICE_PAGES.find((p) => p.service === s.title);
            const body = (
              <div className="group h-full rounded-2xl border border-border bg-bg-card p-7 transition hover:border-accent/60">
                <div className="service-icon-box flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.description}
                </p>
                {page && (
                  <span className="mt-4 inline-block text-sm font-semibold text-accent">
                    {s.title} in detail →
                  </span>
                )}
              </div>
            );
            return (
              <Reveal key={s.title} delay={i * 0.06}>
                {page ? (
                  <Link
                    href={`/services/${page.slug}`}
                    className="block h-full"
                  >
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </Reveal>
            );
          })}
      </div>
    </Section>
  );
}
