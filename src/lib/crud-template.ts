import type { Locale } from "@/i18n/config";

export interface CrudPromptInput {
  featureName: string; entityName: string; description: string; framework: string; database: string; authentication: string; uiLibrary: string; validationLibrary: string; accessPermission: string; fields: string;
  imageUpload: boolean; search: boolean; pagination: boolean; filter: boolean; sort: boolean; softDelete: boolean; auditLog: boolean; tests: boolean; rls: boolean; adminPage: boolean;
}

const requirements = ["Clean Architecture folder structure.", "Schema, migrations, indexes, and constraints.", "Typed CRUD API with validation, authorization, errors, and status codes.", "Responsive, accessible UI with loading, empty, and error states."];
const optionalFeatures: Array<[keyof Pick<CrudPromptInput, "imageUpload" | "search" | "pagination" | "filter" | "sort" | "softDelete" | "auditLog" | "tests" | "rls" | "adminPage">, string]> = [
  ["imageUpload", "Secure image upload with file type and size validation."], ["search", "Debounced search with suitable indexes."], ["pagination", "Server-side pagination."], ["filter", "Server-side filters."], ["sort", "Allow-listed sorting."], ["softDelete", "Soft delete with default exclusion."], ["auditLog", "Audit log for changes."], ["tests", "Tests for success, validation, and authorization."], ["rls", "Supabase RLS and role policies."], ["adminPage", "Admin management page."],
];

export function createCrudPrompt(input: CrudPromptInput, locale: Locale = "lo") {
  const selected = optionalFeatures.filter(([key]) => input[key]).map(([, text]) => text);
  const intro = locale === "lo" ? "ທ່ານເປັນ Senior Full-Stack Engineer, Software Architect ແລະ UI/UX Designer." : "You are a Senior Full-Stack Engineer, Software Architect, and UI/UX Designer.";
  return `${intro}\n\nImplement \"${input.featureName.trim()}\" for entity \"${input.entityName.trim()}\".\n\nCONTEXT\n- Description: ${input.description.trim()}\n- Framework: ${input.framework}\n- Database: ${input.database}\n- Authentication: ${input.authentication}\n- UI library: ${input.uiLibrary}\n- Validation: ${input.validationLibrary}\n- Access: ${input.accessPermission}\n- Fields: ${input.fields.trim()}\n\nREQUIREMENTS\n${[...requirements, ...selected].map((item) => `- ${item}`).join("\n")}\n\nREQUIRED OUTPUT\n1. Architecture and data flow\n2. Folder structure\n3. Database migration and API contract\n4. Complete implementation by file\n5. Security, performance, and test plan\n\nDo not use any, hard-code secrets, or skip error handling.`;
}
