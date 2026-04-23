"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  // Render placeholder cùng kích thước để tránh layout shift
  if (!mounted) {
    return (
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
        "bg-surface-lowest hover:bg-surface-low",
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
