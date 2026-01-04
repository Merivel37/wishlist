'use client';

import { useEffect, useState } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Restaurant } from "@/types/schema";
import { getRestaurants, addRestaurant } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Search, Sparkles, Loader2, Plus } from "lucide-react";

export default function EatPage() {
    const [view, setView] = useState<'wishlist' | 'favorites' | 'discover'>('wishlist');
    const [items, setItems] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    // Discovery State
    const [discoveryQuery, setDiscoveryQuery] = useState('');
    const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
    const [discovering, setDiscovering] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        const data = await getRestaurants();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDiscover = async () => {
        setDiscovering(true);
        try {
            const res = await fetch('/api/discover/restaurants', {
                method: 'POST',
                body: JSON.stringify({ query: discoveryQuery }),
            });
            const data = await res.json();
            setDiscoveryResults(data.restaurants || []);
        } catch (e) {
            console.error(e);
        } finally {
            setDiscovering(false);
        }
    };

    const handleQuickAdd = async (r: any) => {
        await addRestaurant({
            name: r.name,
            location: r.location,
            cuisine: r.cuisine,
            priceRange: r.priceRange,
            review: r.reason, // Use AI reason as initial review
            status: 'wishlist',
            bookingUrl: r.bookingUrl
        });
        // Optimistic update or refetch
        fetchItems();
    };

    const filteredItems = items.filter(i => {
        if (view === 'wishlist') return i.status === 'wishlist' || i.status === 'visited'; // Visited can be in history
        if (view === 'favorites') return i.status === 'favorite';
        return false;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">To Eat</h1>
                    <p className="text-white/60">London dining guide and discovery.</p>
                </div>

                <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                    <button onClick={() => setView('wishlist')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${view === 'wishlist' ? 'bg-white text-black' : 'text-white/60'}`}>Wishlist</button>
                    <button onClick={() => setView('favorites')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${view === 'favorites' ? 'bg-white text-black' : 'text-white/60'}`}>Favourites</button>
                    <button onClick={() => setView('discover')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${view === 'discover' ? 'bg-indigo-500 text-white' : 'text-white/60'}`}>
                        <Sparkles size={14} /> Discover
                    </button>
                </div>
            </div>

            {/* Content */}
            {view === 'discover' ? (
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Ask the Concierge</h2>
                                <p className="text-sm text-white/50">Find top rated spots in London.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <input
                                value={discoveryQuery}
                                onChange={(e) => setDiscoveryQuery(e.target.value)}
                                placeholder="e.g. 'Best pasta in Shoreditch' or 'Romantic date night'"
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
                                onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
                            />
                            <button
                                onClick={handleDiscover}
                                disabled={discovering}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                {discovering ? <Loader2 className="animate-spin" /> : 'Search'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {discoveryResults.map((r, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group hover:bg-white/10"
                            >
                                <div>
                                    <h3 className="font-bold text-white">{r.name}</h3>
                                    <p className="text-sm text-white/60">{r.cuisine} • {r.location} • {r.priceRange}</p>
                                    <p className="text-xs text-indigo-300 mt-1">{r.reason}</p>
                                </div>
                                <button
                                    onClick={() => handleQuickAdd(r)}
                                    className="p-2 bg-white/10 rounded-full hover:bg-white text-white hover:text-black transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)
                    ) : items.filter(i => view === 'favorites' ? i.status === 'favorite' : i.status !== 'favorite').map((item) => (
                        <RestaurantCard key={item.id} item={item} />
                    ))}
                    {!loading && filteredItems.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                            <p className="text-white/30">No restaurants found. Try "Discover" mode!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
