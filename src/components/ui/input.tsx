import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("h-10 w-full rounded-xl border bg-transparent px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:ring-2 focus:ring-violet-400", className)} {...props} />
));
Input.displayName = "Input";
