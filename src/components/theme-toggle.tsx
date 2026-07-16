"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  return <Button variant="ghost" size="sm" aria-label={t("theme.toggle")} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
    <Sun className="size-4 dark:hidden" /><Moon className="hidden size-4 dark:block" />
  </Button>;
}
