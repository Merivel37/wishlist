"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
    const pathname = usePathname();

    const getTitle = () => {
        switch (pathname) {
            case "/":
            case "/wishlist":
                return "Wishlist";
            case "/obsessions":
                return "Obsessions";
            case "/share":
                return "Sharing";
            case "/surprise-me":
                return "Surprise Me";
            default:
                return "Wishlist";
        }
    };

    return (
        <header className={cn("fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border", className)}>
            <div className="flex items-center justify-between h-14 max-w-md mx-auto px-4">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{getTitle()}</h1>
                {/* Placeholder for future actions (e.g. Profile, Settings) */}
                <div className="w-8" />
            </div>
        </header>
    );
}
