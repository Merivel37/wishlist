"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, Zap, Users, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";

const tabs = [
    { name: "Wishlist", href: "/wishlist", icon: List },
    { name: "Obsessions", href: "/obsessions", icon: Zap },
    { name: "Sharing", href: "/share", icon: Users },
    { name: "Surprise Me", href: "/surprise-me", icon: Sparkles },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex flex-col bg-card/50 backdrop-blur-sm p-6", className)}>
            <div className="mb-10 px-2">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Wishlist 2.0
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href === "/wishlist" && pathname === "/");
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "fill-current")} />
                            <span>{tab.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border pt-6 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
                <div className="w-full px-4 py-2">
                    <LoginButton />
                </div>
            </div>
        </aside>
    );
}
