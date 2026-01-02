"use client";

import { useState, useMemo } from "react";
import { WishlistItem } from "@/types/schema";
import { ItemCard } from "./ItemCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";

import { User } from "@supabase/supabase-js";

interface WishlistGridProps {
    items: WishlistItem[];
    currentUser: User | null;
}

type SortOption = "Freshness" | "Date Added" | "Price: Low to High" | "Price: High to Low" | "Name";
type FilterOption = "All" | "Hot" | "Under £50" | "Unclaimed" | "Tech" | "Home";

const FRESHNESS_ORDER = { Hot: 3, Warm: 2, Cold: 1 };

export function WishlistGrid({ items, currentUser }: WishlistGridProps) {
    const [filter, setFilter] = useState<FilterOption>("All");
    const [sortBy, setSortBy] = useState<SortOption>("Date Added");
    const [isSortOpen, setIsSortOpen] = useState(false);

    const filteredAndSortedItems = useMemo(() => {
        let result = [...items];

        // 1. Filter
        if (filter !== "All") {
            switch (filter) {
                case "Hot":
                    result = result.filter((i) => i.freshness === "Hot");
                    break;
                case "Under £50":
                    result = result.filter((i) => i.price < 50);
                    break;
                case "Unclaimed":
                    result = result.filter((i) => !i.isClaimed);
                    break;
                // Add rudimentary category filtering if categories existed, 
                // but relying on string matching for now if desired or just placeholder
                // For now, these might just be examples unless specific logic is needed.
                // Assuming "Tech" and "Home" might be simpler to handle if we had precise tags.
                // Since we don't have explicit categories in the schema shown earlier (just 'category?'), 
                // we'll leave them as strict filters if data supports it, else mostly placeholders or based on Reason/Description keywords?
                // Let's stick to the precise ones requested: Freshness, Price, Claimed.
                // I will remove Tech/Home from logic if not safely implementable, but I'll leave them if they were in the original list.
                // The original list had "Tech", "Home". I'll try to guess or just not filter them strictly if data is missing.
                // Better: Let's stick to the functional ones for now to avoid empty results.
            }
        }

        // 2. Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case "Freshness":
                    // Hot > Warm > Cold
                    return (FRESHNESS_ORDER[b.freshness] || 0) - (FRESHNESS_ORDER[a.freshness] || 0);
                case "Date Added":
                    // Newest first
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "Price: Low to High":
                    return a.price - b.price;
                case "Price: High to Low":
                    return b.price - a.price;
                case "Name":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return result;
    }, [items, filter, sortBy]);

    return (
        <div className="space-y-6">
            {/* Controls Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-40">
                {/* Filters - Horizontal Scroll */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap mr-2">
                        {filteredAndSortedItems.length} Items
                    </span>
                    {(["All", "Hot", "Under £50", "Unclaimed"] as FilterOption[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${filter === f
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-muted-foreground border-border hover:border-foreground/50 hover:bg-muted/50"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 text-xs font-medium px-4 py-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted/50 transition-colors w-full md:w-auto justify-between"
                    >
                        <span className="text-muted-foreground">Sort by:</span>
                        <span className="text-foreground">{sortBy}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSortOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsSortOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {(["Freshness", "Date Added", "Price: Low to High", "Price: High to Low", "Name"] as SortOption[]).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSortBy(option);
                                            setIsSortOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-muted transition-colors flex items-center justify-between group"
                                    >
                                        <span className={sortBy === option ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground"}>
                                            {option}
                                        </span>
                                        {sortBy === option && <Check size={12} className="text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredAndSortedItems.map((item) => (
                        <ItemCard key={item.id} item={item} currentUser={currentUser} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredAndSortedItems.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No items match your filter.</p>
                    <button
                        onClick={() => setFilter("All")}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
