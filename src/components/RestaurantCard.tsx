'use client';

import { Restaurant } from "@/types/schema";
import { motion } from "framer-motion";
import { MapPin, Star, DollarSign, Calendar } from "lucide-react";

interface RestaurantCardProps {
    item: Restaurant;
    onStatusChange?: (id: string, status: 'wishlist' | 'visited' | 'favorite') => void;
}

export const RestaurantCard = ({ item, onStatusChange }: RestaurantCardProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                        <MapPin size={12} />
                        <span>{item.location || 'London'}</span>
                        <span>•</span>
                        <span>{item.cuisine || 'Restaurant'}</span>
                    </div>
                </div>
                {item.rating && (
                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                        <span>{item.rating}</span>
                        <Star size={10} fill="currentColor" />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="font-mono text-green-400">{item.priceRange || '$$'}</span>
                {item.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded-full bg-white/10">{tag}</span>
                ))}
            </div>

            {item.review && (
                <p className="text-sm text-white/70 line-clamp-2 italic">"{item.review}"</p>
            )}

            <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
                {item.bookingUrl && (
                    <a
                        href={item.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-xs font-medium bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Calendar size={12} />
                        Book Table
                    </a>
                )}
                {/* Placeholder for status toggle action if needed */}
                <div className="px-2 py-2 text-center text-xs text-white/30 border border-white/10 rounded-lg">
                    {item.status.toUpperCase()}
                </div>
            </div>
        </motion.div>
    );
};
