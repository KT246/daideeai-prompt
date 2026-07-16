export type PromptAccess = "free" | "pro";

export interface PromptSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  copyCount: number;
  likeCount: number;
  access: PromptAccess;
  createdAt: string;
  content?: string;
}

export interface PromptDetail extends PromptSummary {
  useCase: string;
  instructions: string;
  content: string;
}

export interface PromptSearchParams {
  query?: string;
  category?: string;
  technology?: string;
  access?: PromptAccess;
  sort?: "newest" | "popular";
  page?: number;
}
