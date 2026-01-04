'use client';

import { useState } from 'react';
// Removed unused custom dialog import
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Book, Film, Tv } from "lucide-react";
import { addMediaItem } from "@/lib/supabase";
import { MediaItem, MediaType } from "@/types/schema";

export const AddMediaModal = ({ onAdded }: { onAdded: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<Partial<MediaItem> | null>(null);

    const handleClassify = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const res = await fetch('/api/classify', {
                method: 'POST',
                body: JSON.stringify({ input }),
            });
            const data = await res.json();

            // Map AI response to MediaItem structure
            setPreview({
                title: data.title,
                type: data.type,
                tags: data.tags,
                review: data.summary, // Use summary as initial review/notes
                url: input.startsWith('http') ? input : undefined,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!preview) return;
        setLoading(true);
        const success = await addMediaItem(preview);
        if (success) {
            setIsOpen(false);
            setPreview(null);
            setInput('');
            onAdded();
        }
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
                <Plus size={18} />
                <span>Add Item</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-white">Add to Library</h2>
                                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {!preview ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm text-white/60">Effectively anything...</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    placeholder="Paste URL or type 'The Matrix'"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                                                    onKeyDown={(e) => e.key === 'Enter' && handleClassify()}
                                                />
                                                <button
                                                    onClick={handleClassify}
                                                    disabled={loading || !input}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                                                >
                                                    {loading ? <Loader2 className="animate-spin" /> : 'Auto-Fill'}
                                                </button>
                                            </div>
                                            <p className="text-xs text-white/30">
                                                AI will determine if it's a book or movie and extract details.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-28 bg-white/5 rounded-lg flex items-center justify-center text-4xl">
                                                {preview.type === 'book' ? '📖' : preview.type === 'movie' ? '🎬' : '📺'}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    value={preview.title}
                                                    onChange={(e) => setPreview({ ...preview, title: e.target.value })}
                                                    className="w-full bg-transparent text-xl font-bold text-white focus:outline-none border-b border-transparent focus:border-white/20"
                                                />
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-white uppercase">
                                                        {preview.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs text-white/50">Summary / Notes</label>
                                            <textarea
                                                value={preview.review || ''}
                                                onChange={(e) => setPreview({ ...preview, review: e.target.value })}
                                                className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-white/30 resize-none"
                                            />
                                        </div>

                                        <div className="pt-2 flex gap-3">
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="flex-1 bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                {loading ? 'Saving...' : 'Add to Collection'}
                                            </button>
                                            <button
                                                onClick={() => setPreview(null)}
                                                className="px-4 py-2 text-white/60 hover:text-white"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
