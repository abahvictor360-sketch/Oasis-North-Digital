"use client";

import { useActionState } from "react";
import { Loader2, Check } from "lucide-react";
import { saveSettings } from "../actions";
import type {
  ProfileData,
  HeroData,
  AboutData,
  ContactData,
  SeoData,
} from "@/content/site";

const cls =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-accent focus:outline-none";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-bg-card p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SettingsForm({
  profile,
  hero,
  about,
  contact,
  seo,
}: {
  profile: ProfileData;
  hero: HeroData;
  about: AboutData;
  contact: ContactData;
  seo: SeoData;
}) {
  const [state, action, pending] = useActionState(saveSettings, null);
  const socialUrl = (i: number) => profile.socials[i]?.url ?? "";

  return (
    <form action={action} className="space-y-6">
      <Card title="Studio details">
        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Studio name">
            <input name="name" defaultValue={profile.name} className={cls} />
          </L>
          <L label="Tagline">
            <input name="role" defaultValue={profile.role} className={cls} />
          </L>
          <L label="Email">
            <input name="email" defaultValue={profile.email} className={cls} />
          </L>
          <L label="Phone (display)">
            <input name="phone" defaultValue={profile.phone} className={cls} />
          </L>
          <L label="Phone (digits only, for links)">
            <input
              name="phoneRaw"
              defaultValue={profile.phoneRaw}
              className={cls}
            />
          </L>
          <L label="Handle">
            <input
              name="handle"
              defaultValue={profile.handle}
              className={cls}
            />
          </L>
        </div>
        <L label="Location">
          <input
            name="location"
            defaultValue={profile.location}
            className={cls}
          />
        </L>
        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Founder name">
            <input
              name="founder"
              defaultValue={profile.founder}
              className={cls}
            />
          </L>
          <L label="Founder title">
            <input
              name="founderRole"
              defaultValue={profile.founderRole}
              className={cls}
            />
          </L>
        </div>
        <L label="Booking link (optional: a Cal.com or Calendly https:// link; leave empty to use the built-in /book page)">
          <input
            name="bookingUrl"
            type="url"
            placeholder="https://cal.com/your-studio/consultation"
            defaultValue={profile.bookingUrl ?? ""}
            className={cls}
          />
        </L>
        <L label="Founder photo (shown in the About section)">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.headshot}
              alt=""
              className="h-16 w-16 rounded-lg border border-border object-cover"
            />
            <div className="flex-1 space-y-2">
              <input
                type="hidden"
                name="headshot"
                defaultValue={profile.headshot}
              />
              <input
                type="file"
                name="headshot__file"
                accept="image/*"
                className="text-xs text-muted"
              />
            </div>
          </div>
        </L>
        <L label="Brand logo (SVG or PNG, optional, replaces the built-in mark)">
          <div className="flex items-center gap-4">
            {profile.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logo}
                alt=""
                className="h-12 w-auto max-w-[120px] rounded-lg border border-border bg-bg p-1 object-contain"
              />
            ) : (
              <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
                no logo
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input
                type="hidden"
                name="logo"
                defaultValue={profile.logo ?? ""}
              />
              <input
                type="file"
                name="logo__file"
                accept="image/svg+xml,image/png,image/*"
                className="text-xs text-muted"
              />
            </div>
          </div>
        </L>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Instagram", "LinkedIn", "GitHub"].map((label, i) => (
            <L key={label} label={`${label} URL`}>
              <input
                name={`social_${i}`}
                defaultValue={socialUrl(i)}
                className={cls}
              />
            </L>
          ))}
        </div>
      </Card>

      <Card title="Hero">
        <L label="Eyebrow">
          <input
            name="hero_eyebrow"
            defaultValue={hero.eyebrow}
            className={cls}
          />
        </L>
        <L label="Headline">
          <textarea
            name="hero_headline"
            defaultValue={hero.headline}
            rows={2}
            className={cls}
          />
        </L>
        <L label="Subtext">
          <textarea
            name="hero_subtext"
            defaultValue={hero.subtext}
            rows={3}
            className={cls}
          />
        </L>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="space-y-2 rounded-lg border border-border p-3"
            >
              <p className="text-xs font-semibold text-muted">Stat {i + 1}</p>
              <input
                name={`stat_${i}_value`}
                type="number"
                defaultValue={hero.stats[i]?.value ?? 0}
                className={cls}
                placeholder="Value"
              />
              <input
                name={`stat_${i}_suffix`}
                defaultValue={hero.stats[i]?.suffix ?? ""}
                className={cls}
                placeholder="Suffix (+)"
              />
              <input
                name={`stat_${i}_label`}
                defaultValue={hero.stats[i]?.label ?? ""}
                className={cls}
                placeholder="Label"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="About">
        <L label="Eyebrow">
          <input
            name="about_eyebrow"
            defaultValue={about.eyebrow}
            className={cls}
          />
        </L>
        <L label="Headline">
          <textarea
            name="about_headline"
            defaultValue={about.headline}
            rows={2}
            className={cls}
          />
        </L>
        <L label="Body">
          <textarea
            name="about_body"
            defaultValue={about.body}
            rows={5}
            className={cls}
          />
        </L>
      </Card>

      <Card title="Contact">
        <L label="Headline">
          <input
            name="contact_headline"
            defaultValue={contact.headline}
            className={cls}
          />
        </L>
        <L label="WhatsApp prefilled message">
          <textarea
            name="contact_whatsapp"
            defaultValue={contact.whatsappMessage}
            rows={2}
            className={cls}
          />
        </L>
      </Card>

      <Card title="SEO & AEO">
        <p className="-mt-2 text-xs text-muted">
          SEO controls how the site appears in Google &amp; social shares. AEO
          (the AI summary) feeds structured data so answer engines (ChatGPT,
          Perplexity, Google AI) describe you accurately.
        </p>
        <L label="Meta title (browser tab + search result title)">
          <input
            name="seo_metaTitle"
            defaultValue={seo.metaTitle}
            className={cls}
          />
        </L>
        <L label="Meta description (search result snippet, ~155 chars)">
          <textarea
            name="seo_metaDescription"
            defaultValue={seo.metaDescription}
            rows={3}
            className={cls}
          />
        </L>
        <L label="Keywords (comma-separated)">
          <textarea
            name="seo_keywords"
            defaultValue={seo.keywords}
            rows={2}
            className={cls}
          />
        </L>
        <L label="Social share image (Open Graph)">
          <div className="flex items-center gap-4">
            {seo.ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={seo.ogImage}
                alt=""
                className="h-16 w-28 rounded-lg border border-border object-cover"
              />
            ) : (
              <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
                no image
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input
                type="hidden"
                name="seo_ogImage"
                defaultValue={seo.ogImage}
              />
              <input
                type="file"
                name="seo_ogImage__file"
                accept="image/*"
                className="text-xs text-muted"
              />
            </div>
          </div>
        </L>
        <L label="AI summary (AEO, factual description for AI answer engines)">
          <textarea
            name="seo_aiSummary"
            defaultValue={seo.aiSummary}
            rows={5}
            className={cls}
          />
        </L>
        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Google site verification code">
            <input
              name="seo_googleVerification"
              defaultValue={seo.googleVerification ?? ""}
              placeholder="from Google Search Console"
              className={cls}
            />
          </L>
          <L label="AEO / Bing verification code">
            <input
              name="seo_bingVerification"
              defaultValue={seo.bingVerification ?? ""}
              placeholder="from Bing Webmaster Tools"
              className={cls}
            />
          </L>
        </div>
        <p className="-mt-1 text-xs text-muted/70">
          Paste only the code value (the part inside{" "}
          <code>content=&quot;…&quot;</code>). Bing powers ChatGPT &amp; Copilot
          answers, so verifying there helps AI answer engines.
        </p>
      </Card>

      <div className="sticky bottom-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06150d] shadow-lg disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Save changes
        </button>
        {state?.error && (
          <span className="text-sm text-red-400">{state.error}</span>
        )}
        {state?.ok && <span className="text-sm text-accent">Saved ✓</span>}
      </div>
    </form>
  );
}
