"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, Zap, Users, Sparkles, Settings, Archive, Trash2, BookOpen, Utensils, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";

const tabs = [
    { name: "Wishlist", href: "/wishlist", icon: List },
    { name: "Obsessions", href: "/obsessions", icon: Zap },
    { name: "Sharing", href: "/share", icon: Users },
    { name: "To Read & Watch", href: "/read-watch", icon: BookOpen },
    { name: "To Eat", href: "/eat", icon: Utensils },
    { name: "To Cook", href: "/cook", icon: ChefHat },
    { name: "Surprise Me", href: "/surprise-me", icon: Sparkles },
    { name: "Archive", href: "/archive", icon: Archive },
    { name: "Trash", href: "/trash", icon: Trash2 },
];

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// ... existing imports ...

export function Sidebar({ className, user }: { className?: string; user: User | null }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.replace("/login"); // Force navigation to login
        router.refresh();
    };

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

                {user ? (
                    <>
                        <div className="px-4 py-2 flex items-center gap-3 mb-2">
                            {/* Avatar or Placeholder */}
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || "User"}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>

                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Settings size={18} />
                            <span>Settings</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <Settings size={18} className="hidden" /> {/* Hack to keep alignment if needed, or just use LogOut */}
                            {/* Actually let's use the Logout icon we removed earlier but need to import it first if we want to use it. 
                                Or valid simplified replacement. 
                             */}
                            <span>Log out</span>
                        </button>
                    </>
                ) : (
                    <div className="w-full px-4 py-2">
                        <LoginButton />
                    </div>
                )}
            </div>
        </aside>
    );
}
