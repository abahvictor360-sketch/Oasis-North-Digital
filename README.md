# Oasis Orchard Stack

The website for Oasis Orchard Stack, a Canadian studio offering website development, custom web and mobile apps, and business automation. Built with Next.js 16, React 19 and Tailwind CSS 4. The public site includes selected work, a filterable project archive, individual project pages, services, client feedback and a project enquiry form. The optional Supabase CMS manages the content and enquiry inbox.

## Rebrand notes

- Brand copy lives in `src/content/site.ts` (`BRAND_NAME`, `PROFILE`, `HERO`, `ABOUT`, `SERVICES`, `SERVICE_PAGES`, `FAQS`, `SEO`). The portfolio is unchanged.
- For a site already backed by Supabase, run the latest migration, `supabase/migrations/2026-11-22-oasis-orchard-stack.sql`, so the CMS copy matches. It keeps the stored email, phone, socials and portfolio.
- Old service URLs `/services/web-development-nigeria` and `/services/ai-product-features` redirect permanently to `/services/web-development-canada` and `/services/business-automation`.
- Set `NEXT_PUBLIC_SITE_URL` to the new domain once it is live, and update the contact email, phone and social links in `/admin → General`.
- Regenerate icons with `node scripts/gen-favicon.mjs`.
- "Book an appointment" buttons open `/book`, a request form (weekday, 30-minute slot, Canadian time zone, video or phone) that posts to `/api/contact` and lands in the inbox as a *Consultation booking*. Confirm each one by email. To use a live scheduler instead, set `bookingUrl` in `PROFILE` (`src/content/site.ts`) to your Cal.com or Calendly link.

## Local development

```bash
npm ci
npm run dev
```

```bash
npm test       # enquiry delivery and CMS-default compatibility
npm run lint
npm run build
npm start
```

## Content and project presentation

- `src/content/site.ts`: typed fallback content, contact details, services and projects.
- `src/content/projects.ts`: homepage selection and concise project summaries/scopes. Entries use the same title-derived slugs as `/work/[slug]`.
- `public/portfolio/`: locally hosted images, with WebP project screenshots.
- `src/lib/data.ts`: server loaders. CMS content takes precedence; static content is used when the backend is unavailable or empty.
- `src/lib/content-defaults.ts` and `src/content/legacy-copy.ts`: refresh exact, untouched copy from the previous seed while preserving custom CMS edits.

The homepage shows six selected projects per filter. The complete archive stays available at `/work`. Project pages expose a live link, an overview, scope where documented and a full-size preview. Professional experience, skills and credentials are available under the About section's expandable panel. Skills are presented without subjective percentage ratings.

When adding a project, put it first in `PORTFOLIO`, add its image and keep `supabase/seed.sql` consistent. For an existing CMS-backed site, deploy the code and use the portfolio import in `/admin/portfolio` to add missing entries. Imports match links or titles and preserve existing content.

## Enquiry delivery

The form posts to `/api/contact`. Phone and budget are optional. A genuine enquiry is accepted only when it is saved to Supabase or, when no database is configured, accepted by the email provider with an email ID. Without either delivery mechanism the endpoint returns `503`, and the interface offers direct email and WhatsApp. Enquiry contents are not logged as a substitute for delivery.

Email notifications include the enquiry details and a link to `/admin/submissions`. Replying addresses the prospective client. All three email variables below must be configured; there is no automatic fallback to Resend's restricted sandbox sender. The notification destination must be a working mailbox. Verifying a domain for sending does not create a receiving inbox such as `info@your-domain.com`.

After changing production variables, deploy again and submit a clearly labelled test enquiry through the live form. Check both the private inbox and Resend's delivery event, then confirm receipt in the destination mailbox. Provider acceptance alone does not prove inbox delivery. If an alert fails after an enquiry is saved, the enquiry remains available in the admin inbox.

The public WhatsApp link opens a conversation; it does not send automatic form alerts. Automatic WhatsApp alerts require a provisioned WhatsApp Business API sender, an approved notification template and server credentials. That integration is not connected yet.

The Meta callback URL is `https://www.victorabah.com/api/webhooks/whatsapp`. Configure `WHATSAPP_VERIFY_TOKEN` as a server-only production secret and enter the identical value in Meta's Verify token field. `GET` echoes Meta's challenge only when the token matches. Configure `META_APP_SECRET` from the Meta app's basic settings to enable `POST` callbacks; requests are checked using HMAC-SHA256 against the raw body before acknowledgement. The verify token is a locally generated shared value, not a Meta access token. Leave client certificates disabled unless mutual TLS is separately configured. This callback acknowledges authentic events without storing or acting on inbound messages; it does not send enquiry alerts.

Configure these environment variables in the deployment environment as needed:

| Variable                        | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Optional CMS and enquiry database URL            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key, subject to database policies  |
| `RESEND_API_KEY`                | Optional notification/email delivery key         |
| `CONTACT_NOTIFY_EMAIL`          | Destination for enquiry notifications            |
| `CONTACT_FROM_EMAIL`            | Verified sender identity for production email    |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site origin; see `src/lib/site-url.ts` |

For a new database, apply `supabase/schema.sql` and provision the admin account and media bucket. `supabase/seed.sql` is a fresh-install seed: it truncates content tables and must not be used to update an existing editorial database. It does not truncate enquiries.

## Accessibility and presentation

The public site includes visible form labels, keyboard focus indicators, a skip link, a native modal mobile menu, reduced-motion styles and content that is visible before hydration. Project names and descriptions are visible on touch devices. Testimonials remain readable without a moving carousel.

Social preview metadata uses `/og.png`. Canonical URLs, sitemap, project metadata and structured data are generated from the shared content. Review production email/database delivery with the deployment's actual credentials; mocked tests do not establish production connectivity.
