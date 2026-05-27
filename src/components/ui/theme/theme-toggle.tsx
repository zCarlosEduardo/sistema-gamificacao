"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative flex items-center
        h-10 w-[74px]
        rounded-full p-1
        transition-colors duration-300
        ${
          isDark
            ? "bg-zinc-900 border border-zinc-800"
            : "bg-zinc-100 border border-zinc-200"
        }
      `}
    >
      {/* Thumb */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
        className={`
          flex h-8 w-8 items-center justify-center
          rounded-full shadow-sm
          ${
            isDark
              ? "bg-zinc-800 text-zinc-100"
              : "bg-white text-amber-500"
          }
        `}
        style={{
          marginLeft: isDark ? "34px" : "0px",
        }}
      >
        <motion.div
          key={theme}
          initial={{
            rotate: -90,
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.div>
      </motion.div>
    </button>
  );
}