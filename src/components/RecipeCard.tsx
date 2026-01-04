'use client';

import { Recipe } from "@/types/schema";
import { motion } from "framer-motion";
import { Utensils, Clock, Flame, ChevronRight } from "lucide-react";

export const RecipeCard = ({ item }: { item: Recipe }) => {
    return (
        <motion.div
            layout
            className="group cursor-pointer flex flex-col overflow-hidden bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
        >
            <div className="relative h-48 w-full bg-gray-800">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍳</div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-bold text-white uppercase">
                    {item.difficulty}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">{item.title}</h3>

                <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
                    {/* Can extract time if available, otherwise just ingredient count */}
                    <div className="flex items-center gap-1">
                        <Utensils size={12} />
                        <span>{item.ingredients?.length || 0} ingredients</span>
                    </div>
                </div>

                <div className="mt-auto px-4 py-2 bg-white/5 rounded-lg text-xs text-white/70 group-hover:bg-white group-hover:text-black transition-colors text-center font-medium">
                    View Recipe
                </div>
            </div>
        </motion.div>
    );
};
