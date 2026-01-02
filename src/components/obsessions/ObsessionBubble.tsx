"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Obsession } from "@/types/schema";

interface ObsessionBubbleProps {
    obsession: Obsession;
}

export function ObsessionBubble({ obsession }: ObsessionBubbleProps) {
    // Size based on heat (0-100)
    const sizeClass =
        obsession.heat > 80 ? "w-40 h-40 text-lg" :
            obsession.heat > 50 ? "w-32 h-32 text-base" :
                "w-24 h-24 text-sm";

    const colorClass =
        obsession.type === "Current" ? "bg-foreground text-background border-transparent" :
            obsession.type === "Seasonal" ? "bg-card border-2 border-accent text-accent-foreground" :
                "bg-muted text-muted-foreground border-transparent opacity-80";

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "rounded-full flex items-center justify-center text-center p-4 font-bold tracking-tight shadow-lg cursor-pointer transition-colors relative overflow-hidden group",
                sizeClass,
                colorClass
            )}
        >
            <span className="relative z-10">{obsession.name}</span>
            {obsession.type === "Current" && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </motion.div>
    );
}
