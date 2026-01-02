"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { User } from "@supabase/supabase-js";
import LoginButton from "@/components/auth/LoginButton";

export function Header({ className, user }: { className?: string; user: User | null }) {
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
                {/* Mobile Auth Action */}
                <div>
                    {user ? (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {user.email?.[0].toUpperCase()}
                        </div>
                    ) : (
                        // Simplified Mobile Login - maybe just an icon or small button
                        <div className="scale-90 origin-right">
                            <LoginButton />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
