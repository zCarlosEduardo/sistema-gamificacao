"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: (activeTab: string) => ReactNode;
}

export function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  function handleChange(tabId: string) {
    setActive(tabId);
    onChange?.(tabId);
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-(--color-border) mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
              active === tab.id
                ? "text-(--color-text)"
                : "text-(--color-text-muted) hover:text-(--color-text)",
            )}
          >
            {tab.icon}
            {tab.label}
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-(--color-primary)"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}