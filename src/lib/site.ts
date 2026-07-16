export const siteConfig = {
  name: "DaideeAI Prompt",
  description: "Tạo prompt lập trình chuẩn, rõ ràng và có thể tái sử dụng.",
  url: "https://prompt.daideeai.com",
} as const;

export const promptCategories = [
  "CRUD", "Tạo chức năng", "Kiểm thử hệ thống", "Sửa lỗi", "Code review",
  "Cơ sở dữ liệu", "Bảo mật", "Triển khai", "Server & Monitoring", "Next.js",
  "Supabase", "MongoDB", "Node.js",
] as const;

export type PromptCategory = (typeof promptCategories)[number];

export const categoryLabels: Record<import("@/i18n/config").Locale, Record<PromptCategory, string>> = {
  vi: { "CRUD": "CRUD", "Tạo chức năng": "Tạo chức năng", "Kiểm thử hệ thống": "Kiểm thử hệ thống", "Sửa lỗi": "Sửa lỗi", "Code review": "Code review", "Cơ sở dữ liệu": "Cơ sở dữ liệu", "Bảo mật": "Bảo mật", "Triển khai": "Triển khai", "Server & Monitoring": "Server & Monitoring", "Next.js": "Next.js", "Supabase": "Supabase", "MongoDB": "MongoDB", "Node.js": "Node.js" },
  en: { "CRUD": "CRUD", "Tạo chức năng": "Feature development", "Kiểm thử hệ thống": "System testing", "Sửa lỗi": "Bug fixing", "Code review": "Code review", "Cơ sở dữ liệu": "Database", "Bảo mật": "Security", "Triển khai": "Deployment", "Server & Monitoring": "Server & Monitoring", "Next.js": "Next.js", "Supabase": "Supabase", "MongoDB": "MongoDB", "Node.js": "Node.js" },
  th: { "CRUD": "CRUD", "Tạo chức năng": "สร้างฟังก์ชัน", "Kiểm thử hệ thống": "ทดสอบระบบ", "Sửa lỗi": "แก้ไขบั๊ก", "Code review": "ตรวจสอบโค้ด", "Cơ sở dữ liệu": "ฐานข้อมูล", "Bảo mật": "ความปลอดภัย", "Triển khai": "การปรับใช้", "Server & Monitoring": "เซิร์ฟเวอร์และมอนิเตอร์", "Next.js": "Next.js", "Supabase": "Supabase", "MongoDB": "MongoDB", "Node.js": "Node.js" },
  lo: { "CRUD": "CRUD", "Tạo chức năng": "ສ້າງຟັງຊັນ", "Kiểm thử hệ thống": "ທົດສອບລະບົບ", "Sửa lỗi": "ແກ້ໄຂບັນຫາ", "Code review": "ກວດສອບ code", "Cơ sở dữ liệu": "ຖານຂໍ້ມູນ", "Bảo mật": "ຄວາມປອດໄພ", "Triển khai": "ການນຳໃຊ້", "Server & Monitoring": "Server ແລະ Monitoring", "Next.js": "Next.js", "Supabase": "Supabase", "MongoDB": "MongoDB", "Node.js": "Node.js" },
};

export const frameworkOptions = ["Next.js App Router", "Next.js Pages Router", "Node.js", "NestJS", "React", "Vue", "Khác"] as const;
export const databaseOptions = ["Supabase PostgreSQL", "PostgreSQL", "MySQL", "MongoDB", "Không dùng"] as const;
