import { ArrowUpRight, Check } from "lucide-react";
import Section from "@/components/Section";

const STEPS = [
  {
    title: "Understand the business",
    body: "We talk through your audience, the problem and what a useful result looks like. You get a defined scope, milestones and a quote before work begins.",
    output: "A shared brief and project plan",
  },
  {
    title: "Make the direction tangible",
    body: "Layouts and key user journeys turn the brief into something you can react to. We review the important decisions together before building out the detail.",
    output: "A design direction you can review",
  },
  {
    title: "Build, review and refine",
    body: "The work progresses in visible stages. We build the interface, the functionality and the automations behind it, test across screen sizes, and work through your feedback.",
    output: "A working product to test",
  },
  {
    title: "Launch with a clear handover",
    body: "We check the agreed scope, prepare the launch and cover how to manage the product. Ongoing improvements and support can be scoped around what you need next.",
    output: "Launch, handover and next steps",
  },
];

export default function Process() {
  return (
    <Section
      id="process"
      eyebrow="HOW WE WORK"
      title="A clear path from first conversation to launch."
    >
      <p className="mb-9 max-w-2xl text-base leading-relaxed text-muted">
        You should always know what is being built, what needs your input and
        what happens next.
      </p>
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <li key={step.title} className="bg-bg-card p-6 sm:p-8">
            <span className="font-display text-sm text-accent">0{i + 1}</span>
            <h3 className="mt-5 font-display text-lg font-semibold">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {step.body}
            </p>
            <p className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-xs">
              <Check className="h-3.5 w-3.5 shrink-0 text-accent" />{" "}
              {step.output}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-accent/5 px-6 py-6">
        <div>
          <h3 className="font-display font-semibold">
            A focused project or a longer partnership.
          </h3>
          <p className="mt-2 text-sm text-muted">
            A new website, a product build, or ongoing development for your
            team. We agree the right scope together.
          </p>
        </div>
        <a
          href="#contact"
          className="inline-flex shrink-0 items-center gap-2 py-2 text-sm font-semibold text-accent"
        >
          Discuss your brief <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}
