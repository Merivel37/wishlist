"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Brand {
    name: string;
    heat: number;
}

interface BrandCloudProps {
    brands: Brand[];
}

export function BrandCloud({ brands }: BrandCloudProps) {
    // Sort by heat for better visual layout logic (simplified here)
    const sortedBrands = [...brands].sort((a, b) => b.heat - a.heat);

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {sortedBrands.map((brand, index) => (
                <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }}
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                        "rounded-xl px-4 py-2 border transition-colors cursor-pointer hover:border-primary hover:text-primary",
                        brand.heat > 80 ? "bg-card border-foreground/20 text-xl font-bold" :
                            brand.heat > 50 ? "bg-card/50 border-border text-lg font-medium" :
                                "bg-muted/30 border-transparent text-sm text-muted-foreground"
                    )}
                >
                    {brand.name}
                </motion.div>
            ))}
        </div>
    );
}
