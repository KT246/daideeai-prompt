export type FieldDefinition = { name: string; type: string; required?: boolean; unique?: boolean; defaultValue?: string; description?: string };

const base = [
  "Use TypeScript strict mode. Do not use any or hard-code secrets.",
  "Explain assumptions and important trade-offs before implementation.",
  "Return an architecture overview, folder tree, database migration, API contract, implementation by file, tests, and manual verification steps.",
  "Include accessible, responsive UI plus loading, empty, error, and success states.",
];

export function createCrudPrompt(input: { featureName: string; entityName: string; description: string; framework: string; database: string; authentication: string; fields: FieldDefinition[]; options: string[] }) {
  const fields = input.fields.map((field) => `- ${field.name}: ${field.type}${field.required ? " (required)" : ""}${field.unique ? " (unique)" : ""}${field.defaultValue ? `; default=${field.defaultValue}` : ""}${field.description ? ` — ${field.description}` : ""}`).join("\n");
  const options = input.options.filter(Boolean).map((value) => `- ${value}`).join("\n") || "- Search, pagination, filtering, sorting, and audit choices must be justified.";
  return `You are a Senior Full-Stack Engineer, Software Architect, and UI/UX Designer. Design and implement the ${input.featureName} feature for entity ${input.entityName}.\n\nCONTEXT\n- Description: ${input.description}\n- Framework: ${input.framework}\n- Database: ${input.database}\n- Authentication: ${input.authentication}\n\nFIELDS\n${fields}\n\nMANDATORY REQUIREMENTS\n1. Clean modular architecture with domain, application, infrastructure, and UI boundaries.\n2. Database schema, migration, constraints, indexes, timestamps, and safe rollback notes.\n3. Strong TypeScript types, Zod schemas, React Hook Form validation, and typed error responses.\n4. Server Actions or route handlers with authentication, authorization, rate limiting strategy, and structured errors.\n5. Full CRUD: list, detail, create, update, delete; ownership and admin access rules.\n6. Search, filter, sort, server pagination, debounce, and allow-listed query parameters.\n7. Accessible responsive UI using reusable components, confirmation before destructive actions, toasts, skeletons, and empty/error states.\n8. Supabase RLS policies and indexes; never trust client-provided ownership.\n9. Unit and integration test cases for success, invalid input, unauthorized, forbidden, and not-found cases.\n10. Documentation with setup and verification commands.\n\nOPTIONAL FEATURES SELECTED\n${options}\n\n${base.map((item) => `- ${item}`).join("\n")}`;
}

export function createFunctionPrompt(input: Record<string, string>) {
  return `You are a Senior TypeScript backend engineer. Implement function \"${input.name}\".\n\nPurpose: ${input.purpose}\nInputs: ${input.inputs}\nOutput: ${input.output}\nBusiness rules: ${input.rules}\nDependencies: ${input.dependencies}\nError cases: ${input.errors}\nPerformance/security notes: ${input.constraints}\n\nProvide types, Zod validation where input crosses a boundary, pure implementation, error strategy, examples, unit tests, complexity analysis, and integration notes. ${base.join(" ")}`;
}

export function createDebugPrompt(input: Record<string, string>) {
  return `You are a Senior Software Engineer debugging a production issue.\n\nSystem: ${input.system}\nExpected behavior: ${input.expected}\nActual behavior: ${input.actual}\nError/logs: ${input.logs}\nReproduction steps: ${input.steps}\nRecent changes/environment: ${input.context}\n\nDeliver: prioritized hypotheses, a minimal reproduction plan, exact diagnostic commands or instrumentation, root-cause analysis, smallest safe fix with code, regression tests, rollback plan, and prevention actions. Do not invent evidence; label assumptions clearly. ${base.join(" ")}`;
}

export function createSystemCheckPrompt(input: Record<string, string>) {
  return `You are a Principal Engineer conducting a system review.\n\nSystem/product: ${input.system}\nArchitecture: ${input.architecture}\nStack and dependencies: ${input.stack}\nData/auth: ${input.data}\nTraffic/SLO: ${input.scale}\nKnown concerns: ${input.concerns}\n\nAssess architecture, security, RLS/auth, performance, reliability, observability, accessibility, testing, CI/CD, cost, and maintainability. For every finding provide severity (Critical, High, Medium, Low, Recommendation), evidence, impact, remediation, owner, and priority. End with a 30/60/90-day action plan and a concise executive summary. ${base.join(" ")}`;
}
