import type { Locale } from "@/i18n/config";

export type TaskPromptMode = "builder" | "debugging" | "system-checking";

const modes: Record<Locale, Record<TaskPromptMode, string>> = {
  vi: { builder: "Tạo chức năng", debugging: "Phân tích và sửa lỗi", "system-checking": "Kiểm tra hệ thống" },
  en: { builder: "Feature implementation", debugging: "Debugging and bug fixing", "system-checking": "System checking" },
  th: { builder: "สร้างฟังก์ชัน", debugging: "วิเคราะห์และแก้ไขบั๊ก", "system-checking": "ตรวจสอบระบบ" },
  lo: { builder: "ສ້າງຟັງຊັນ", debugging: "ວິເຄາະ ແລະ ແກ້ໄຂບັນຫາ", "system-checking": "ກວດສອບລະບົບ" },
};

const copies: Record<Locale, { role: string; task: string; context: string; requirements: string; mode: string; closing: string; items: string[] }> = {
  vi: { role: "Bạn là Senior Full-Stack Engineer.", task: "Hãy thực hiện tác vụ", context: "BỐI CẢNH", requirements: "YÊU CẦU", mode: "CHẾ ĐỘ", closing: "Nêu security considerations, performance considerations và cách kiểm thử.", items: ["Phân tích mục tiêu, edge case, bảo mật và hiệu năng trước khi viết code.", "Đề xuất architecture/data flow và các file cần thay đổi.", "Viết implementation TypeScript rõ ràng, không dùng any, có validation và error handling."] },
  en: { role: "You are a Senior Full-Stack Engineer.", task: "Complete this task", context: "CONTEXT", requirements: "REQUIREMENTS", mode: "MODE", closing: "Include security considerations, performance considerations, and a test plan.", items: ["Analyze goals, edge cases, security, and performance before writing code.", "Propose architecture/data flow and files to change.", "Write clear TypeScript implementation without any, with validation and error handling."] },
  th: { role: "คุณเป็น Senior Full-Stack Engineer.", task: "ทำงานนี้", context: "บริบท", requirements: "ความต้องการ", mode: "โหมด", closing: "ระบุ security considerations, performance considerations และแผนการทดสอบ", items: ["วิเคราะห์เป้าหมาย edge case ความปลอดภัย และประสิทธิภาพก่อนเขียนโค้ด", "เสนอ architecture/data flow และไฟล์ที่ต้องแก้ไข", "เขียน TypeScript ที่ชัดเจนโดยไม่ใช้ any พร้อม validation และ error handling"] },
  lo: { role: "ທ່ານເປັນ Senior Full-Stack Engineer.", task: "ດຳເນີນວຽກນີ້", context: "ບໍລິບົດ", requirements: "ຄວາມຕ້ອງການ", mode: "ໂໝດ", closing: "ລະບຸ security considerations, performance considerations ແລະ ແຜນການທົດສອບ.", items: ["ວິເຄາະເປົ້າໝາຍ, edge case, ຄວາມປອດໄພ ແລະ performance ກ່ອນຂຽນ code.", "ສະເໜີ architecture/data flow ແລະ ໄຟລ໌ທີ່ຕ້ອງປ່ຽນ.", "ຂຽນ TypeScript ທີ່ຊັດເຈນ ໂດຍບໍ່ໃຊ້ any, ມີ validation ແລະ error handling."] },
};

export function createTaskPrompt(task: string, context: string, mode: TaskPromptMode, locale: Locale) {
  const copy = copies[locale];
  return `${copy.role}\n${copy.task}: ${task.trim()}.\n\n${copy.context}\n${context.trim()}\n\n${copy.requirements}\n${copy.items.map((item) => `- ${item}`).join("\n")}\n- ${copy.closing}\n\n${copy.mode}\n${modes[locale][mode]}`;
}
