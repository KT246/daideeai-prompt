import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("min-h-28 w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[var(--muted)] focus:ring-2 focus:ring-violet-400", className)} {...props} />
));
Textarea.displayName = "Textarea";
