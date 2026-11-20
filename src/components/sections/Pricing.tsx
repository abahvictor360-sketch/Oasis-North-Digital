import { Check } from "lucide-react";
import type { PricingTier } from "@/content/site";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";

export default function Pricing({ pricing: PRICING }: { pricing: PricingTier[] }) {
  return (
    <Section id="pricing" eyebrow="PRICING" title="Ways to work together.">
      <div className="grid gap-5 md:grid-cols-2">
        {PRICING.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <div
              className={`flex h-full flex-col rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-accent bg-bg-card accent-glow"
                  : "border-border bg-bg-card"
              }`}
            >
              {tier.highlighted && (
                <span className="mb-4 inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-[#06150d]">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
              <p className="mt-3 font-display text-3xl font-bold text-accent">{tier.price}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{tier.blurb}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 block rounded-full py-3 text-center font-semibold transition ${
                  tier.highlighted
                    ? "bg-accent text-[#06150d] hover:bg-accent-dim"
                    : "border border-border hover:border-accent hover:text-accent"
                }`}
              >
                Start a project
              </a>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">Final pricing & inclusions are set in the admin.</p>
    </Section>
  );
}
