"use client";

import { motion } from "framer-motion";
import { Share2, UserPlus, Eye, EyeOff, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock Data for "Family Members"
const initialMembers = [
    { id: "1", name: "Mom", role: "Family", canSeeClaims: true },
    { id: "2", name: "Partner", role: "Family", canSeeClaims: true },
];

export default function SharingPage() {
    const [copied, setCopied] = useState(false);
    const shareUrl = "https://wishlist.app/share/m4tt-w1sh"; // Mock URL

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 py-6 animate-in fade-in duration-700">

            {/* Share Link Card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Share2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Share your Wishlist</h2>
                        <p className="text-muted-foreground text-sm">Anyone with this link can view your list.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl border border-border/50">
                    <code className="flex-1 text-sm font-mono truncate">{shareUrl}</code>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            copied ? "bg-green-500/20 text-green-600" : "hover:bg-background text-foreground"
                        )}
                    >
                        {copied ? <span className="text-xs font-bold px-1">Copied</span> : <Copy size={16} />}
                    </button>
                </div>
            </div>

            {/* Visibility Settings */}
            <section className="space-y-4">
                <h3 className="font-semibold text-lg">Visibility Settings</h3>

                <div className="bg-card rounded-xl border border-border divide-y divide-border">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <EyeOff size={20} className="text-muted-foreground" />
                            <div>
                                <p className="font-medium">Hide Claimed Items</p>
                                <p className="text-xs text-muted-foreground">Don't show me what's been bought.</p>
                            </div>
                        </div>
                        {/* Visual Toggle - Mocked */}
                        <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full shadow-sm" />
                        </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Eye size={20} className="text-muted-foreground" />
                            <div>
                                <p className="font-medium">Public Profile</p>
                                <p className="text-xs text-muted-foreground">Allow search engines to find my list.</p>
                            </div>
                        </div>
                        <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Family Access */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Family & Friends</h3>
                    <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                        <UserPlus size={16} /> Invite
                    </button>
                </div>

                <div className="space-y-2">
                    {initialMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-card/50 rounded-xl border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                    {member.name[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{member.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{member.role}</p>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Can see claims
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
