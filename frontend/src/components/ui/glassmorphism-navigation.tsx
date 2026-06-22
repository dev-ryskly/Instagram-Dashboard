import { motion } from "framer-motion";
import { LayoutDashboard, Library, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tab } from "../NavTabs";

interface NavigationItem {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "content", label: "Content Library", icon: Library },
  { id: "publish", label: "Publish & Track", icon: Send },
];

interface GlassmorphismNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const GlassmorphismNavigation = ({
  activeTab,
  onTabChange,
}: GlassmorphismNavigationProps) => {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="flex items-center justify-between w-full max-w-4xl px-6 py-2.5 border border-white/10 rounded-full bg-slate-950/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
          <span className="hidden sm:inline font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            InstaDash
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-4 w-4 relative z-10", isActive && "text-pink-400")} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
