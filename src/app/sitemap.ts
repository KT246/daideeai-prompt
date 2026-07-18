import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap { return ["/", "/prompts", "/generators/crud", "/generators/function", "/generators/debug", "/generators/system-check", "/pricing", "/login"].map((path) => ({ url: new URL(path, siteConfig.url).toString(), lastModified: new Date(), changeFrequency: "weekly", priority: path === "/" ? 1 : 0.7 })); }
