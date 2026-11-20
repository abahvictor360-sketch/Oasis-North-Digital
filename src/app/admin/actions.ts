"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase";
import { getResource } from "./config";
import { missingPortfolioItems } from "./sync";

async function client() {
  const sb = await createServerSupabase();
  if (!sb) throw new Error("Supabase is not configured.");
  return sb;
}

async function requireUser() {
  const sb = await client();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

/** Refresh the public site + the admin view after a write. */
function refresh(path?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/services");
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/admin", "layout");
  if (path) revalidatePath(path);
}

// --------------------------------------------------------------------------
// Auth
// --------------------------------------------------------------------------

export async function signIn(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const sb = await client();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/admin");
}

export async function signOut() {
  const sb = await client();
  await sb.auth.signOut();
  redirect("/admin/login");
}

// --------------------------------------------------------------------------
// Media upload
// --------------------------------------------------------------------------

async function uploadIfPresent(
  sb: Awaited<ReturnType<typeof client>>,
  folder: string,
  file: FormDataEntryValue | null,
): Promise<string | null> {
  if (!file || typeof file === "string") return null;
  const f = file as File;
  if (!f.size) return null;
  const ext = f.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage.from("media").upload(path, f, {
    cacheControl: "3600",
    upsert: false,
    contentType: f.type || undefined,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}

// --------------------------------------------------------------------------
// Generic collection CRUD (driven by config.ts)
// --------------------------------------------------------------------------

export async function saveRow(_prev: unknown, formData: FormData) {
  const sb = await requireUser();
  const key = String(formData.get("__resource"));
  const resource = getResource(key);
  if (!resource) return { error: "Unknown resource." };

  const id = String(formData.get("__id") ?? "");
  const row: Record<string, unknown> = {};

  for (const field of resource.fields) {
    switch (field.type) {
      case "number":
        row[field.name] = Number(formData.get(field.name) ?? 0);
        break;
      case "boolean":
        row[field.name] = formData.get(field.name) === "on";
        break;
      case "array":
        row[field.name] = String(formData.get(field.name) ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "image":
      case "video": {
        const uploaded = await uploadIfPresent(
          sb,
          key,
          formData.get(`${field.name}__file`),
        );
        const existing = String(formData.get(field.name) ?? "");
        row[field.name] = uploaded ?? (existing || null);
        break;
      }
      default:
        row[field.name] = String(formData.get(field.name) ?? "") || null;
    }
  }

  try {
    if (id) {
      const { error } = await sb.from(resource.table).update(row).eq("id", id);
      if (error) throw error;
    } else {
      if (resource.newestFirst) {
        // Newest-first lists (portfolio, blog): the new row goes to the top so
        // it is the first thing a visitor sees, and everything else shifts down.
        const { data: existing } = await sb
          .from(resource.table)
          .select("id, sort_order")
          .order("sort_order");
        row.sort_order = 0;
        const { error } = await sb.from(resource.table).insert(row);
        if (error) throw error;
        for (const [i, r] of (existing ?? []).entries()) {
          await sb
            .from(resource.table)
            .update({ sort_order: i + 1 })
            .eq("id", r.id);
        }
      } else {
        // Append to the end of the list.
        const { count } = await sb
          .from(resource.table)
          .select("*", { count: "exact", head: true });
        row.sort_order = count ?? 0;
        const { error } = await sb.from(resource.table).insert(row);
        if (error) throw error;
      }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Save failed." };
  }

  refresh(`/admin/${key}`);
  return { ok: true };
}

export async function deleteRow(formData: FormData) {
  const sb = await requireUser();
  const key = String(formData.get("__resource"));
  const id = String(formData.get("__id"));
  const resource = getResource(key);
  if (!resource || !id) return;
  await sb.from(resource.table).delete().eq("id", id);
  refresh(`/admin/${key}`);
}

export async function moveRow(formData: FormData) {
  const sb = await requireUser();
  const key = String(formData.get("__resource"));
  const id = String(formData.get("__id"));
  const dir = String(formData.get("__dir")); // "up" | "down"
  const resource = getResource(key);
  if (!resource) return;

  const { data: rows } = await sb
    .from(resource.table)
    .select("id, sort_order")
    .order("sort_order");
  if (!rows) return;
  const i = rows.findIndex((r) => String(r.id) === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= rows.length) return;

  await sb
    .from(resource.table)
    .update({ sort_order: rows[j].sort_order })
    .eq("id", rows[i].id);
  await sb
    .from(resource.table)
    .update({ sort_order: rows[i].sort_order })
    .eq("id", rows[j].id);
  refresh(`/admin/${key}`);
}

/**
 * Import portfolio items that are in src/content/site.ts but missing from
 * Supabase. New items go to the top (site.ts order, newest first) and every
 * existing row shifts down; nothing existing is edited or deleted.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function importPortfolioFromSite(_prev: unknown) {
  const sb = await requireUser();
  const { data: rows, error } = await sb
    .from("portfolio_items")
    .select("id, title, link, sort_order")
    .order("sort_order");
  if (error) return { error: `Could not read the portfolio: ${error.message}` };
  if (!rows) return { error: "Could not read the portfolio." };

  const missing = missingPortfolioItems(rows);
  if (missing.length === 0) return { ok: true };

  const { error: insertError } = await sb.from("portfolio_items").insert(
    missing.map((item, i) => ({
      title: item.title,
      category: item.category,
      description: item.description,
      image_url: item.image || null,
      video_url: item.video ?? null,
      link: item.link ?? null,
      is_video: Boolean(item.isVideoPlaceholder),
      // Temporary slots below the existing rows; reordered to the top once the
      // insert succeeds, so a rejected insert leaves the list untouched.
      sort_order: rows.length + i,
    })),
  );
  if (insertError) {
    const hint = /violates check constraint/i.test(insertError.message)
      ? " The database still has the old category list — run supabase/migrations/2026-09-24-app-development.sql in the Supabase SQL editor."
      : "";
    return { error: `Import failed: ${insertError.message}.${hint}` };
  }

  // New items first (site.ts order), then the existing rows in their old order.
  const { data: fresh } = await sb
    .from("portfolio_items")
    .select("id, title, link, sort_order")
    .order("sort_order");
  if (fresh) {
    const isNew = (r: { title?: unknown; link?: unknown }) =>
      missing.some(
        (m) =>
          String(m.title).toLowerCase() ===
            String(r.title ?? "").toLowerCase() &&
          (!m.link || String(m.link) === String(r.link ?? "")),
      );
    const ordered = [...fresh.filter(isNew), ...fresh.filter((r) => !isNew(r))];
    for (const [i, r] of ordered.entries()) {
      await sb.from("portfolio_items").update({ sort_order: i }).eq("id", r.id);
    }
  }

  refresh("/admin/portfolio");
  return { ok: true };
}

// --------------------------------------------------------------------------
// Site settings (profile / hero / about / contact JSONB)
// --------------------------------------------------------------------------

export async function saveSettings(_prev: unknown, formData: FormData) {
  const sb = await requireUser();

  const stats = [0, 1, 2].map((i) => ({
    value: Number(formData.get(`stat_${i}_value`) ?? 0),
    suffix: String(formData.get(`stat_${i}_suffix`) ?? ""),
    label: String(formData.get(`stat_${i}_label`) ?? ""),
  }));

  const socialLabels = ["Instagram", "LinkedIn", "GitHub"];
  const icons = ["instagram", "linkedin", "github"];
  const socials = socialLabels.map((label, i) => ({
    label,
    icon: icons[i],
    url: String(formData.get(`social_${i}`) ?? ""),
  }));

  let headshot = String(formData.get("headshot") ?? "");
  const uploaded = await uploadIfPresent(
    sb,
    "profile",
    formData.get("headshot__file"),
  );
  if (uploaded) headshot = uploaded;

  let logo = String(formData.get("logo") ?? "");
  const uploadedLogo = await uploadIfPresent(
    sb,
    "logo",
    formData.get("logo__file"),
  );
  if (uploadedLogo) logo = uploadedLogo;

  let ogImage = String(formData.get("seo_ogImage") ?? "");
  const uploadedOg = await uploadIfPresent(
    sb,
    "seo",
    formData.get("seo_ogImage__file"),
  );
  if (uploadedOg) ogImage = uploadedOg;

  const payload = {
    id: 1,
    profile: {
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      phoneRaw: String(formData.get("phoneRaw") ?? ""),
      location: String(formData.get("location") ?? ""),
      handle: String(formData.get("handle") ?? ""),
      founder: String(formData.get("founder") ?? ""),
      founderRole: String(formData.get("founderRole") ?? ""),
      // Only an absolute https link is kept; anything else falls back to /book.
      bookingUrl: /^https:\/\/\S+$/.test(
        String(formData.get("bookingUrl") ?? "").trim(),
      )
        ? String(formData.get("bookingUrl")).trim()
        : "",
      headshot,
      logo,
      socials,
    },
    hero: {
      eyebrow: String(formData.get("hero_eyebrow") ?? ""),
      headline: String(formData.get("hero_headline") ?? ""),
      subtext: String(formData.get("hero_subtext") ?? ""),
      stats,
    },
    about: {
      eyebrow: String(formData.get("about_eyebrow") ?? ""),
      headline: String(formData.get("about_headline") ?? ""),
      body: String(formData.get("about_body") ?? ""),
    },
    contact: {
      headline: String(formData.get("contact_headline") ?? ""),
      whatsappMessage: String(formData.get("contact_whatsapp") ?? ""),
    },
    seo: {
      metaTitle: String(formData.get("seo_metaTitle") ?? ""),
      metaDescription: String(formData.get("seo_metaDescription") ?? ""),
      keywords: String(formData.get("seo_keywords") ?? ""),
      ogImage: ogImage,
      aiSummary: String(formData.get("seo_aiSummary") ?? ""),
      googleVerification: String(formData.get("seo_googleVerification") ?? ""),
      bingVerification: String(formData.get("seo_bingVerification") ?? ""),
    },
    updated_at: new Date().toISOString(),
  };

  const { error } = await sb.from("site_settings").upsert(payload);
  if (error) return { error: error.message };
  refresh("/admin/general");
  return { ok: true };
}

// --------------------------------------------------------------------------
// Submissions inbox
// --------------------------------------------------------------------------

export async function toggleSubmissionRead(formData: FormData) {
  const sb = await requireUser();
  const id = String(formData.get("id"));
  const isRead = formData.get("is_read") === "true";
  await sb.from("submissions").update({ is_read: !isRead }).eq("id", id);
  refresh("/admin/submissions");
}

export async function deleteSubmission(formData: FormData) {
  const sb = await requireUser();
  const id = String(formData.get("id"));
  await sb.from("submissions").delete().eq("id", id);
  refresh("/admin/submissions");
}
