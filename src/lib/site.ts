import type { Locale } from "@/i18n/config";

export const siteConfig = {
  name: "DaideeAI Prompt",
  description: "Clear, reusable programming prompts for modern software projects.",
  url: "https://prompt.daideeai.com",
} as const;

export const promptCategories = [
  "CRUD", "Feature development", "System testing", "Bug fixing", "Code review",
  "Database", "Security", "Deployment", "Server & Monitoring", "Next.js",
  "Supabase", "MongoDB", "Node.js",
] as const;

export type PromptCategory = (typeof promptCategories)[number];

export const categoryLabels: Record<Locale, Record<PromptCategory, string>> = {
  en: Object.fromEntries(promptCategories.map((category) => [category, category])) as Record<PromptCategory, string>,
  lo: {
    "CRUD": "CRUD", "Feature development": "ພັດທະນາຟັງຊັນ", "System testing": "ທົດສອບລະບົບ", "Bug fixing": "ແກ້ໄຂບັນຫາ", "Code review": "ກວດສອບ code",
    "Database": "ຖານຂໍ້ມູນ", "Security": "ຄວາມປອດໄພ", "Deployment": "ການນຳໃຊ້", "Server & Monitoring": "Server ແລະ Monitoring", "Next.js": "Next.js",
    "Supabase": "Supabase", "MongoDB": "MongoDB", "Node.js": "Node.js",
  },
};

export const frameworkOptions = ["Next.js App Router", "Next.js Pages Router", "Node.js", "NestJS", "React", "Vue", "Other"] as const;
export const databaseOptions = ["Supabase PostgreSQL", "PostgreSQL", "MySQL", "MongoDB", "None"] as const;
