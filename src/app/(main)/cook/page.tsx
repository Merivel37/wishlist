'use client';

import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/types/schema";
import { getRecipes, addRecipe } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Link as LinkIcon, Loader2, X, ChefHat } from "lucide-react";

export default function CookPage() {
    const [items, setItems] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Add State
    const [urlInput, setUrlInput] = useState('');
    const [extracting, setExtracting] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        const data = await getRecipes();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleExtract = async () => {
        if (!urlInput) return;
        setExtracting(true);
        try {
            const res = await fetch('/api/extract-recipe', {
                method: 'POST',
                body: JSON.stringify({ input: urlInput }),
            });
            const data = await res.json();

            // Save immediately for this prototype, or show preview. Saving for speed.
            await addRecipe({
                title: data.title,
                ingredients: data.ingredients,
                method: data.method,
                difficulty: data.difficulty,
                sourceUrl: urlInput,
                // Default image if none scraped (AI doesn't scrape images easily without Puppeteer, usually returns text)
                // For now we leave image empty or use a placeholder in UI
            });

            setIsAddOpen(false);
            setUrlInput('');
            fetchItems();
        } catch (e) {
            console.error(e);
        } finally {
            setExtracting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">To Cook</h1>
                    <p className="text-white/60">Family recipe vault and culinary experiments.</p>
                </div>

                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                    <Plus size={18} />
                    <span>Import Recipe</span>
                </button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4"
                        >
                            <div className="flex justify-between items-center text-white">
                                <h3 className="font-bold text-lg">Import from Web</h3>
                                <button onClick={() => setIsAddOpen(false)}><X size={20} /></button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/50">Recipe URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="https://cooking.nytimes.com/..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                    />
                                </div>
                            </div>
                            <div className="bg-indigo-500/10 p-3 rounded-lg flex gap-3 items-start">
                                <ChefHat className="text-indigo-400 mt-1" size={18} />
                                <p className="text-xs text-indigo-200">
                                    Our AI Chef will strip away the blog stories and ads, saving just the ingredients and method for you.
                                </p>
                            </div>
                            <button
                                onClick={handleExtract}
                                disabled={extracting || !urlInput}
                                className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 flex justify-center"
                            >
                                {extracting ? <Loader2 className="animate-spin" /> : 'Extract & Save'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="text-white/30">Loading vault...</div>
                ) : items.map((item) => (
                    <RecipeCard key={item.id} item={item} />
                ))}
                {!loading && items.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                        <p className="text-white/30">Your vault is empty. Import a recipe!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
