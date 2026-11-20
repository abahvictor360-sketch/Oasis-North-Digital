import type { Skill } from "@/content/site";
import Section from "@/components/Section";

export default function Skills({ skills: SKILLS }: { skills: Skill[] }) {
  return (
    <Section id="skills" eyebrow="OUR STACK" title="The stack behind every build.">
      <ul className="flex flex-wrap gap-3">
        {SKILLS.map((s) => (
          <li
            key={s.name}
            className="rounded-full border border-border bg-bg-card px-4 py-2.5 text-sm"
          >
            {s.name}
          </li>
        ))}
      </ul>
    </Section>
  );
}
