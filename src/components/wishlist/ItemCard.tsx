"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Flame, Search, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WishlistItem } from "@/types/schema";
import { cn } from "@/lib/utils";

interface ItemCardProps {
    item: WishlistItem;
}

const freshnessColors = {
    Hot: "bg-red-500 text-white shadow-red-500/20",
    Warm: "bg-orange-400 text-white shadow-orange-400/20",
    Cold: "bg-blue-400 text-white shadow-blue-400/20",
};

export function ItemCard({ item }: ItemCardProps) {
    const [imageError, setImageError] = useState(false); // Added state for image error
    // Placeholder for missing variable
    // In a real scenario, this would come from props or another state.
    const isGreyedOut = item.purchaseStatus === "Purchased";

    if (imageError) return null;

    return (
        <motion.div
            layout // Added layout prop
            initial={{ opacity: 0, scale: 0.9 }} // Modified initial prop
            animate={{ opacity: isGreyedOut ? 0.6 : 1, scale: 1, filter: isGreyedOut ? "grayscale(100%)" : "none" }} // Modified animate prop
            exit={{ opacity: 0, scale: 0.9 }} // Added exit prop
            className={`group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full ${isGreyedOut ? "pointer-events-none" : ""}`} // Modified className
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {item.photoUrl && !imageError ? ( // Modified condition to include imageError
                    <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setImageError(true)} // Added onError handler
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 bg-muted/50 p-6 text-center">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-medium uppercase tracking-widest opacity-60">No Image</span>
                    </div>
                )}

                {/* Freshness Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <div className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md",
                        freshnessColors[item.freshness]
                    )}>
                        {item.freshness}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                        <span className="font-mono text-sm font-semibold text-muted-foreground">
                            {item.currency}{item.price}
                        </span>
                    </div>
                    {item.brand && <p className="text-xs text-muted-foreground font-medium mt-1">{item.brand}</p>}
                </div>

                {/* Footer Actions/Info */}
                <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        {/* Placeholder or other info if needed, otherwise empty logic for now */}
                        <span></span>
                    </div>

                    {item.storeLink && (
                        <a
                            href={item.storeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink size={12} strokeWidth={3} />
                            BUY
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
