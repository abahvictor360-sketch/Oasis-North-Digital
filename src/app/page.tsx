import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Skills from "@/components/sections/Skills";
import Portfolio from "@/components/sections/Portfolio";
import Faq from "@/components/sections/Faq";
import Testimonials from "@/components/sections/Testimonials";
import Clients from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";
import Process from "@/components/sections/Process";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { homeStructuredData } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/seo";
import {
  getSettings,
  getEducation,
  getServices,
  getSkills,
  getPortfolio,
  getTestimonials,
  getClients,
} from "@/lib/data";

// Re-fetch periodically; admin mutations call revalidatePath('/') for instant updates.
export const revalidate = 300;

// SEO — title/description/keywords/OG are editable in /admin → General → SEO & AEO.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSettings();
  const otherVerification: Record<string, string> = {};
  if (seo.bingVerification)
    otherVerification["msvalidate.01"] = seo.bingVerification;
  return {
    ...pageMetadata({
      title: seo.metaTitle,
      description: seo.metaDescription,
      path: "/",
      image: seo.ogImage,
    }),
    keywords: seo.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    verification: {
      google: seo.googleVerification || undefined,
      other: Object.keys(otherVerification).length
        ? otherVerification
        : undefined,
    },
  };
}

export default async function Home() {
  const [
    settings,
    education,
    services,
    skills,
    portfolio,
    testimonials,
    clients,
  ] = await Promise.all([
    getSettings(),
    getEducation(),
    getServices(),
    getSkills(),
    getPortfolio(),
    getTestimonials(),
    getClients(),
  ]);

  const { profile, hero, about, contact, seo } = settings;

  const jsonLd = homeStructuredData({
    profile,
    about,
    education,
    services,
    skills,
    portfolio,
    seo,
  });

  return (
    <>
      <JsonLd value={jsonLd} />
      <SiteHeader profile={profile} />
      <main id="main-content">
        <div>
          <Hero
            hero={hero}
            profile={profile}
            project={
              portfolio.find((p) => p.title === "Lume") ??
              portfolio.find((p) => p.image && p.category === "Websites")
            }
            projectCount={portfolio.length}
          />
          <Clients clients={clients} />
          <Portfolio items={portfolio} />
          <Testimonials testimonials={testimonials} />
          <Services services={services} />
          <Process />
          <About about={about} profile={profile} />
          <Skills skills={skills} />
          <Faq />
          <Contact profile={profile} contact={contact} />
          <Footer profile={profile} />
        </div>
      </main>
      <WhatsAppWidget profile={profile} message={contact.whatsappMessage} />
    </>
  );
}
