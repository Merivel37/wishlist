"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { WishlistItem } from "@/types/schema";
import Image from "next/image";
import { X, Heart, Pin } from "lucide-react";

interface SwipeCardProps {
    item: WishlistItem;
    onSwipe: (direction: "left" | "right") => void;
    style?: React.CSSProperties;
}

import { useState } from "react";

export function SwipeCard({ item, onSwipe, index = 0 }: SwipeCardProps & { index?: number }) {
    const [aspectRatio, setAspectRatio] = useState<"portrait" | "landscape" | "square">("portrait");
    const [isLoaded, setIsLoaded] = useState(false);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Messy Stack Logic: Deterministic rotation based on index
    const isFront = index === 0;
    // Messy rotation: Alternating small angles for back cards to look "shuffled"
    const randomRotate = isFront ? 0 : (index % 2 === 0 ? 3 : -3) + (index * (index % 3 === 0 ? 1 : -1));

    // Fan out vertically but less aggressively, rely on messy rotation for visibility
    const yOffset = index * 8;
    const scale = 1 - index * 0.04;

    // Back cards are SOLID but dimmer
    const brightness = 1 - index * 0.1;

    // Feedback colors (green/red overlays)
    const rightOpacity = useTransform(x, [0, 150], [0, 0.4]);
    const leftOpacity = useTransform(x, [-150, 0], [0.4, 0]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        if (Math.abs(info.offset.x) > threshold) {
            const velocity = info.velocity.x;
            // Add momentum check roughly
            if (Math.abs(velocity) > 500 || Math.abs(info.offset.x) > 150) {
                onSwipe(info.offset.x > 0 ? "right" : "left");
            }
        }
    };

    const getCardDimensions = () => {
        switch (aspectRatio) {
            case "landscape":
                return "w-full max-w-[480px] aspect-[4/3]";
            case "square":
                return "w-full max-w-[400px] aspect-square";
            default: // portrait
                return "w-full max-w-[340px] aspect-[3/5] max-h-[70vh]";
        }
    };

    return (
        <motion.div
            layout
            style={{
                x: isFront ? x : 0,
                rotate: isFront ? rotate : randomRotate,
                zIndex: 100 - index,
                y: yOffset,
                scale: scale,
                filter: `brightness(${brightness})`,
            }}
            animate={{
                x: isFront ? undefined : 0,
                rotate: isFront ? undefined : randomRotate,
                scale,
                y: yOffset,
                zIndex: 100 - index,
                filter: `brightness(${brightness})`,
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            // Add elastic drag for better feel
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 0.8
            }}
            // Changed positioning to inset-0 m-auto for true centering regardless of size
            className={`absolute inset-0 m-auto ${getCardDimensions()} rounded-[32px] overflow-hidden shadow-2xl bg-black border border-white/10 touch-none cursor-grab active:cursor-grabbing origin-center transition-all duration-500`}
        >
            {/* Full Bleed Image */}
            <div className="absolute inset-0 z-0">
                {item.photoUrl ? (
                    <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        className={`object-cover pointer-events-none select-none transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        draggable={false}
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority={index < 2}
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth > img.naturalHeight * 1.2) {
                                setAspectRatio("landscape");
                            } else if (img.naturalHeight > img.naturalWidth * 1.2) {
                                setAspectRatio("portrait");
                            } else {
                                setAspectRatio("square");
                            }
                            setIsLoaded(true);
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-900 text-neutral-500 font-medium tracking-widest uppercase text-sm">
                        No Image
                    </div>
                )}
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

            {/* Swipe Feedback Overlays */}
            {isFront && (
                <>
                    <motion.div style={{ opacity: rightOpacity }} className="absolute inset-0 z-20 bg-green-500 pointer-events-none mix-blend-overlay" />
                    <motion.div style={{ opacity: leftOpacity }} className="absolute inset-0 z-20 bg-red-500 pointer-events-none mix-blend-overlay" />
                    {/* Icons */}
                    <motion.div style={{ opacity: rightOpacity }} className="absolute top-8 left-8 z-30 border-4 border-green-400 rounded-lg px-4 py-2 text-green-400 font-black text-3xl uppercase -rotate-12 tracking-widest shadow-2xl backdrop-blur-sm">
                        KEEP
                    </motion.div>
                    <motion.div style={{ opacity: leftOpacity }} className="absolute top-8 right-8 z-30 border-4 border-red-500 rounded-lg px-4 py-2 text-red-500 font-black text-3xl uppercase rotate-12 tracking-widest shadow-2xl backdrop-blur-sm">
                        PASS
                    </motion.div>
                </>
            )}

            {/* Content Section */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-30 text-white pb-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className={`text-2xl font-bold leading-tight drop-shadow-md ${aspectRatio === 'landscape' ? 'line-clamp-1' : 'line-clamp-3'}`}>
                            {item.name}
                        </h2>
                        {item.price > 0 && (
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full font-mono font-bold text-lg shadow-sm shrink-0">
                                {item.currency}{item.price}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 opacity-80 text-sm font-medium">
                        {item.brand && <span className="uppercase tracking-wider">{item.brand}</span>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
