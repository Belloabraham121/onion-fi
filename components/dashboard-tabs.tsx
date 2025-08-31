"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface DashboardTabsProps {
  activeTab: "protocols" | "vaults"
  onTabChange: (tab: "protocols" | "vaults") => void
}

const tabs = [
  { id: "protocols", label: "Protocols" },
  { id: "vaults", label: "Vaults" },
]

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="border-b border-gray-800/50 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as "protocols" | "vaults")}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}