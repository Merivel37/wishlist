"use client";

import { useState, useEffect } from "react";
import { SwipeCard } from "@/components/surprise-me/SwipeCard";
import { WishlistItem } from "@/types/schema";
import { AnimatePresence } from "framer-motion";
import { RefreshCcw, X, Heart } from "lucide-react";
import { tagItem } from "@/app/actions";

interface SurpriseMeClientProps {
    initialItems: WishlistItem[];
}

export default function SurpriseMeClient({ initialItems }: SurpriseMeClientProps) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [history, setHistory] = useState<WishlistItem[]>([]);

    // Shuffle on mount and filter for valid images
    useEffect(() => {
        // Filter first, then shuffle
        const validItems = initialItems.filter(item => item.photoUrl && item.photoUrl.trim() !== "");
        const shuffled = [...validItems].sort(() => Math.random() - 0.5);
        setItems(shuffled);
    }, [initialItems]);

    const handleSwipe = async (direction: "left" | "right") => {
        if (items.length === 0) return;

        const [currentItem, ...rest] = items;

        // Optimistic UI: Remove from stack immediately (don't loop back if passed?)
        // User asked: "can you tag it and write that tag status"
        // If we "Pass", we probably want to remove it from this session.
        // If we "Keep", maybe we keep it or also remove from 'surprise' deck?
        // Let's remove from current deck in both cases to advance.

        setItems(rest); // Remove from front

        // Write back
        const action = direction === "right" ? "keep" : "pass";
        console.log(`Swiping ${direction} on ${currentItem.name} -> ${action}`);

        // Fire and forget, or handle error?
        try {
            await tagItem(currentItem.id, action);
        } catch (err) {
            console.error("Failed to tag item:", err);
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handleSwipe("left");
            if (e.key === "ArrowRight") handleSwipe("right");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [items]);

    // Render more cards to allow the "return to bottom" effect to be seen if the list is long enough.
    // Showing 5 layers gives enough depth.
    const topCards = items.slice(0, 5);

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] w-full relative">
            <AnimatePresence mode="popLayout">
                {items.length > 0 ? (
                    <div className="relative w-full h-[65vh] flex items-center justify-center perspective-1000">
                        {topCards.map((item, index) => (
                            <SwipeCard
                                key={item.id}
                                item={item}
                                index={index}
                                onSwipe={handleSwipe}
                            />
                        )).reverse()}
                    </div>
                ) : (
                    <div className="text-center space-y-4 animate-in fade-in">
                        <h3 className="text-xl font-bold">List is empty</h3>
                        <p className="text-muted-foreground">Add items to your wishlist first.</p>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-8 mt-8 z-10">
                <button
                    onClick={() => handleSwipe("left")}
                    className="p-4 rounded-full bg-background border border-border shadow-lg hover:scale-110 active:scale-95 transition-transform text-red-500"
                    aria-label="Pass"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="text-center text-sm text-muted-foreground animate-pulse px-4">
                    Use arrow keys
                </div>
                <button
                    onClick={() => handleSwipe("right")}
                    className="p-4 rounded-full bg-background border border-border shadow-lg hover:scale-110 active:scale-95 transition-transform text-green-500"
                    aria-label="Like"
                >
                    <Heart className="w-8 h-8 fill-current" />
                </button>
            </div>
        </div>
    );
}
