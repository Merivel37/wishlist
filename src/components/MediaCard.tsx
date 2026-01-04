'use client';

import { MediaItem } from "@/types/schema";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import Image from "next/image";

interface MediaCardProps {
    item: MediaItem;
}

export const MediaCard = ({ item }: MediaCardProps) => {
    const isBook = item.type === 'book';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm"
        >
            <div className={`relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg ${!item.image ? 'bg-gray-800 flex items-center justify-center' : ''}`}>
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <span className="text-white/30 text-xs">No Cover</span>
                )}

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                    {item.status}
                </div>
            </div>

            <div className="w-full text-center space-y-1">
                <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight">
                    {item.title}
                </h3>
                {item.rating && (
                    <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs">
                        <Star size={12} fill="currentColor" />
                        <span>{item.rating}</span>
                    </div>
                )}
            </div>

            {item.url && (
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                    <ExternalLink size={14} className="text-white" />
                </a>
            )}
        </motion.div>
    );
};
