import { getSettings } from "@/lib/data";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function GeneralPage() {
  const { profile, hero, about, contact, seo } = await getSettings();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Site settings</h1>
      <SettingsForm
        profile={profile}
        hero={hero}
        about={about}
        contact={contact}
        seo={seo}
      />
    </div>
  );
}
