
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Image as ImageIcon, Loader2, MoreVertical, RefreshCcw, Trash2, Pencil, Archive, Check, X } from "lucide-react";
import Image from "next/image";
import { WishlistItem } from "@/types/schema";
import { cn } from "@/lib/utils";

import { User } from "@supabase/supabase-js";
import { claimItem, updateStatus, updateItemTitle, unclaimItem } from "@/app/actions";

interface ItemCardProps {
    item: WishlistItem;
    currentUser: User | null;
    isArchiveView?: boolean;
}

const freshnessColors: Record<string, string> = {
    Hot: "bg-red-500 text-white shadow-red-500/20",
    Warm: "bg-orange-400 text-white shadow-orange-400/20",
    Cold: "bg-blue-400 text-white shadow-blue-400/20",
};

export function ItemCard({ item, currentUser, isArchiveView }: ItemCardProps) {
    const [imageError, setImageError] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Edit Title State
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(item.name);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Optimistic State
    const [optClaimedBy, setOptClaimedBy] = useState(item.claimedBy);
    const [optStatus, setOptStatus] = useState(item.status);
    const [optPurchaseStatus, setOptPurchaseStatus] = useState(item.purchaseStatus);

    // Sync prop changes (server revalidation) to local state
    useEffect(() => {
        setOptClaimedBy(item.claimedBy);
        setOptStatus(item.status);
        setOptPurchaseStatus(item.purchaseStatus);
    }, [item.claimedBy, item.status, item.purchaseStatus]);

    // Computed checks using OPTIMISTIC state
    const isPurchased = optPurchaseStatus === "Purchased";
    const isClaimedByMe = currentUser?.email && optClaimedBy === currentUser.email;
    const isClaimed = !!optClaimedBy;

    const handleClaim = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) return;

        // Optimistic Update
        setOptClaimedBy(currentUser.email);
        setIsClaiming(true);

        const success = await claimItem(item.id);

        if (!success) {
            // Revert on failure
            setOptClaimedBy(item.claimedBy);
        }
        setIsClaiming(false);
    };

    const handleUnclaim = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) return;

        // Optimistic Update
        setOptClaimedBy(undefined); // Visually unclaim immediately
        setIsClaiming(true);

        const success = await unclaimItem(item.id);

        if (!success) {
            setOptClaimedBy(currentUser.email); // Revert
        }
        setIsClaiming(false);
    };

    const handleStatusUpdate = async (type: "Archive" | "Active" | "Purchased") => {
        // Optimistic Updates
        setShowMenu(false);
        const prevStatus = optStatus;
        const prevPurchaseStatus = optPurchaseStatus;

        if (type === "Archive") {
            setOptStatus("Archived");
        } else if (type === "Active") {
            setOptStatus("Active");
            setOptPurchaseStatus("Unpurchased");
        } else if (type === "Purchased") {
            setOptPurchaseStatus("Purchased");
        }

        setIsUpdating(true);
        const success = await updateStatus(item.id, {
            status: type === "Archive" || type === "Active" ? type === "Archive" ? "Archived" : "Active" : undefined,
            purchaseStatus: type === "Purchased" ? "Purchased" : type === "Active" ? "Unpurchased" : undefined
        });

        if (!success) {
            // Revert
            setOptStatus(prevStatus);
            setOptPurchaseStatus(prevPurchaseStatus);
        }
        setIsUpdating(false);
    }

    const handleTitleSave = async () => {
        if (editedTitle.trim() !== item.name) {
            await updateItemTitle(item.id, editedTitle);
        }
        setIsEditingTitle(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleTitleSave();
        } else if (e.key === "Escape") {
            setEditedTitle(item.name);
            setIsEditingTitle(false);
        }
    };

    if (imageError) return null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isPurchased && !isArchiveView ? 0.6 : 1, scale: 1, filter: isPurchased && !isArchiveView ? "grayscale(100%)" : "none" }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {item.photoUrl && !imageError ? (
                    <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-700 group-hover:scale-105",
                            isClaimed && "grayscale-[50%]" // Slight greyscale when claimed
                        )}
                        onError={() => setImageError(true)}
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
                        freshnessColors[item.freshness || "Cold"]
                    )}>
                        {item.freshness}
                    </div>
                </div>

                {/* Trash Icon (Discrete Hover) */}
                {currentUser && !isArchiveView && (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate("Archive"); }}
                        className="absolute bottom-3 right-3 p-2 bg-black/40 text-white/70 hover:text-red-400 hover:bg-black/60 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 hover:scale-100 cursor-pointer z-20"
                        title="Move to Trash"
                    >
                        <Trash2 size={16} />
                    </button>
                )}

                {/* Claimed Overlay (Only if NOT claimed by me, so we see "Claimed" by others overlay) */}
                {isClaimed && !isClaimedByMe && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="px-3 py-1 bg-background/90 text-foreground rounded-full text-xs font-bold shadow-xl border border-border/50">
                            Claimed by {optClaimedBy?.split('@')[0]}
                        </div>
                    </div>
                )}

                {/* BLUE Claimed By You Button (Hover to Unclaim) */}
                {isClaimedByMe && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                        <button
                            onClick={handleUnclaim}
                            className="group/unclaim px-5 py-2 bg-blue-600 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-xl border border-white/10 tracking-wide transition-all duration-300 hover:scale-105 w-[140px]"
                        >
                            <span className="block group-hover/unclaim:hidden flex items-center justify-center gap-2">
                                Claimed
                            </span>
                            <span className="hidden group-hover/unclaim:flex items-center justify-center gap-2">
                                <X size={14} strokeWidth={3} /> Unclaim
                            </span>
                        </button>
                    </div>
                )}

                {/* Action Menu (Top Left) */}
                {currentUser && (
                    <div className="absolute top-3 left-3 z-30">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                            className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                                <div className="absolute top-full left-0 mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-2xl z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    {!isArchiveView && !isPurchased && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate("Purchased"); }}
                                            disabled={isUpdating}
                                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-muted/50 flex items-center gap-2 font-medium transition-colors"
                                        >
                                            <ShoppingBag size={14} /> Mark Purchased
                                        </button>
                                    )}
                                    {!isArchiveView && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate("Archive"); }}
                                            disabled={isUpdating}
                                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-muted/50 flex items-center gap-2 text-destructive font-medium transition-colors"
                                        >
                                            <Archive size={14} /> Archive
                                        </button>
                                    )}
                                    {(isArchiveView || isPurchased) && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate("Active"); }}
                                            disabled={isUpdating}
                                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-muted/50 flex items-center gap-2 text-green-600 font-medium transition-colors"
                                        >
                                            <RefreshCcw size={14} /> Reactivate Item
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div>
                    <div className="flex justify-between items-start group/title relative">
                        {isEditingTitle ? (
                            <input
                                ref={titleInputRef}
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-lg leading-tight bg-transparent border-b border-primary outline-none text-foreground w-full py-0"
                            />
                        ) : (
                            <>
                                <h3
                                    className="font-bold text-lg leading-tight group-hover:text-primary transition-colors pr-6 cursor-text"
                                    onClick={(e) => { if (currentUser) { e.stopPropagation(); setIsEditingTitle(true); } }}
                                >
                                    {item.name}
                                </h3>
                                {/* Pencil Icon on Hover */}
                                {currentUser && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
                                        className="absolute right-0 top-0 p-1 text-muted-foreground hover:text-primary opacity-0 group-hover/title:opacity-100 transition-opacity"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                )}
                            </>
                        )}

                        {!isEditingTitle && (
                            <span className="font-mono text-sm font-semibold text-muted-foreground ml-2 whitespace-nowrap">
                                {item.currency}{item.price}
                            </span>
                        )}
                    </div>
                    {item.brand && <p className="text-xs text-muted-foreground font-medium mt-1">{item.brand}</p>}
                </div>

                <div className="flex-1" /> {/* Spacer */}

                {/* Footer Actions/Info */}
                <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-3 text-xs text-muted-foreground gap-2">

                    {/* Claim Button / Purchased Stamp logic */}
                    {isPurchased ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600/20 text-green-600 border border-green-600/30 font-bold uppercase tracking-wide">
                            <Check size={12} strokeWidth={3} />
                            Purchased
                        </div>
                    ) : !isClaimed && currentUser ? (
                        <button
                            onClick={handleClaim}
                            disabled={isClaiming}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {isClaiming ? <Loader2 size={12} className="animate-spin" /> : "Claim"}
                        </button>
                    ) : (
                        <div /> // Empty spacer
                    )}

                    {item.storeLink && (
                        <a
                            href={item.storeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 ml-auto"
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
