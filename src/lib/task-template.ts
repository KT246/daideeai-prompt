import type { Locale } from "@/i18n/config";

export type TaskPromptMode = "builder" | "debugging" | "system-checking";

type PromptCopy = { role: string; task: string; context: string; requirements: string; mode: string; closing: string; items: string[] };

const modes: Record<Locale, Record<TaskPromptMode, string>> = {
  en: { builder: "Feature implementation", debugging: "Debugging and bug fixing", "system-checking": "System checking" },
  lo: { builder: "ສ້າງຟັງຊັນ", debugging: "ວິເຄາະ ແລະ ແກ້ໄຂບັນຫາ", "system-checking": "ກວດສອບລະບົບ" },
};

const copies: Record<Locale, PromptCopy> = {
  en: { role: "You are a Senior Full-Stack Engineer.", task: "Complete this task", context: "CONTEXT", requirements: "REQUIREMENTS", mode: "MODE", closing: "Include security considerations, performance considerations, and a test plan.", items: ["Analyze goals, edge cases, security, and performance before writing code.", "Propose architecture/data flow and files to change.", "Write clear TypeScript implementation without any, with validation and error handling."] },
  lo: { role: "ທ່ານເປັນ Senior Full-Stack Engineer.", task: "ດຳເນີນວຽກນີ້", context: "ບໍລິບົດ", requirements: "ຄວາມຕ້ອງການ", mode: "ໂໝດ", closing: "ລະບຸ security considerations, performance considerations ແລະ ແຜນການທົດສອບ.", items: ["ວິເຄາະເປົ້າໝາຍ, edge case, ຄວາມປອດໄພ ແລະ performance ກ່ອນຂຽນ code.", "ສະເໜີ architecture/data flow ແລະ ໄຟລ໌ທີ່ຕ້ອງປ່ຽນ.", "ຂຽນ TypeScript ທີ່ຊັດເຈນ ໂດຍບໍ່ໃຊ້ any, ມີ validation ແລະ error handling."] },
};

export function createTaskPrompt(task: string, context: string, mode: TaskPromptMode, locale: Locale) {
  const copy = copies[locale];
  return `${copy.role}\n${copy.task}: ${task.trim()}.\n\n${copy.context}\n${context.trim()}\n\n${copy.requirements}\n${copy.items.map((item) => `- ${item}`).join("\n")}\n- ${copy.closing}\n\n${copy.mode}\n${modes[locale][mode]}`;
}
