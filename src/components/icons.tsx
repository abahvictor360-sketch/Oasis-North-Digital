import {
  Palette,
  Film,
  Code,
  Sparkles,
  Bot,
  Cpu,
  Workflow,
  Smartphone,
  Home,
  User,
  Briefcase,
  Layers,
  BarChart3,
  LayoutGrid,
  MessageSquare,
  Building2,
  Mail,
  Award,
  Route,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";

/**
 * Brand/social marks are inlined — recent lucide-react versions removed brand
 * icons (Instagram, LinkedIn, Dribbble, Behance) for trademark reasons.
 */
type IconProps = { className?: string };

function Instagram({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Linkedin({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V10.4H5.67v7.94h2.67zM7 9.24a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.1v-4.36c0-2.33-1.25-3.42-2.92-3.42-1.34 0-1.94.74-2.28 1.26v-1.08h-2.66c.04.75 0 7.94 0 7.94h2.66v-4.43c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.81v4.24h2.66z" />
    </svg>
  );
}

function Dribbble({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    </svg>
  );
}

function Behance({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M9.06 12.9c.46.2.82.49 1.07.86.25.37.37.83.37 1.36 0 .55-.13 1.02-.4 1.4-.18.26-.4.47-.67.65-.27.17-.6.3-.96.37-.37.08-.77.11-1.2.11H3V7.5h4.06c1.02 0 1.79.16 2.32.55.53.4.79 1 .79 1.83 0 .44-.1.82-.31 1.13-.2.3-.5.55-.9.74.37.12.7.3.96.55-.04-.13.04.6.04.6zM5.2 9.2v1.95h1.74c.4 0 .72-.08.95-.24.23-.16.34-.42.34-.78 0-.34-.12-.58-.36-.71-.24-.14-.56-.21-.97-.21H5.2zm2.06 5.8c.45 0 .8-.1 1.05-.28.25-.19.37-.49.37-.9 0-.4-.13-.7-.39-.88-.26-.18-.62-.27-1.08-.27H5.2V15h2.06zM16.5 8.4h3.86v.94H16.5V8.4zm3.86 5.6c0 .15-.01.3-.03.45h-4.4c.04.49.2.85.46 1.08.27.23.6.34 1.01.34.3 0 .56-.06.78-.2.22-.13.36-.3.43-.51h1.65c-.2.66-.55 1.16-1.04 1.5-.49.34-1.09.51-1.8.51-.5 0-.94-.08-1.34-.24-.4-.16-.73-.39-1-.68-.27-.3-.48-.65-.62-1.06-.14-.4-.21-.86-.21-1.36 0-.49.07-.94.22-1.35.15-.41.36-.76.63-1.05.27-.3.6-.52.98-.69.38-.16.8-.24 1.27-.24.5 0 .94.1 1.33.29.38.19.7.45.95.78.26.33.44.7.56 1.13.1.37.15.78.13 1.21l-.66.04z" />
    </svg>
  );
}

function Github({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.59.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

const SOCIAL: Record<string, (p: IconProps) => React.ReactElement> = {
  instagram: Instagram,
  linkedin: Linkedin,
  dribbble: Dribbble,
  behance: Behance,
  github: Github,
};

const SERVICE: Record<string, LucideIcon> = {
  palette: Palette,
  film: Film,
  code: Code,
  sparkles: Sparkles,
  bot: Bot,
  cpu: Cpu,
  smartphone: Smartphone,
  workflow: Workflow,
};

const NAV: Record<string, LucideIcon> = {
  home: Home,
  about: User,
  resume: Briefcase,
  services: Layers,
  skills: BarChart3,
  certifications: Award,
  portfolio: LayoutGrid,
  process: Route,
  faq: CircleHelp,
  testimonials: MessageSquare,
  clients: Building2,
  contact: Mail,
};

export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = NAV[name] ?? Home;
  return <Cmp className={className} />;
}

export function SocialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = SOCIAL[name] ?? Instagram;
  return <Cmp className={className} />;
}

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = SERVICE[name] ?? Palette;
  return <Cmp className={className} />;
}
