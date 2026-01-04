'use client';

import { useEffect, useState } from "react";
import { MediaCard } from "@/components/MediaCard";
import { AddMediaModal } from "@/components/AddMediaModal";
import { getMediaItems } from "@/lib/supabase";
import { MediaItem } from "@/types/schema";
import { motion } from "framer-motion";

export default function ReadWatchPage() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [filter, setFilter] = useState<'all' | 'read' | 'watch'>('all');
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        const data = await getMediaItems();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'read') return item.type === 'book';
        if (filter === 'watch') return item.type === 'movie' || item.type === 'tv';
        return true;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">To Read and To Watch</h1>
                    <p className="text-white/60">Curated collection of wisdom and entertainment.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                        {['all', 'read', 'watch'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-white text-black'
                                    : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <AddMediaModal onAdded={fetchItems} />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-white/30">Loading library...</div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredItems.map((item) => (
                        <MediaCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-white/40">No items found in this category.</p>
                </div>
            )}
        </div>
    );
}
