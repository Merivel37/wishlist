"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, Zap, Users, Sparkles, Archive, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
    {
        name: "Wishlist",
        href: "/wishlist",
        icon: List,
    },
    {
        name: "Archive",
        href: "/archive",
        icon: Archive,
    },
    {
        name: "Surprise",
        href: "/surprise-me",
        icon: Sparkles,
    },
    {
        name: "Library",
        href: "/read-watch",
        icon: BookOpen,
    },
    {
        name: "Share",
        href: "/share",
        icon: Users,
    },
];

export function BottomNav({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <nav className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pb-safe", className)}>
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href === "/wishlist" && pathname === "/");
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"
                            )}
                        >
                            <div className="relative">
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute -inset-2 bg-primary/10 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
