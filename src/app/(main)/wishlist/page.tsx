import { WishlistGrid } from "@/components/wishlist/WishlistGrid";
import { Plus, Database, AlertCircle } from "lucide-react";
import { getWishlistItems } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

// Async Server Component
export default async function WishlistPage() {
    const items = await getWishlistItems();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isEmpty = items.length === 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">

            {!isEmpty ? (
                <WishlistGrid items={items} currentUser={user} />
            ) : (
                /* Empty State / Error Handling */
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-border rounded-xl bg-card/30">
                    <div className="p-4 bg-muted rounded-full">
                        <Database size={32} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-foreground">No Items Found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Check your database connection or add items to your Google Sheet.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-orange-500 font-mono bg-orange-500/10 px-3 py-1 rounded-md">
                        <AlertCircle size={12} />
                        <span>Credentials or access missing</span>
                    </div>
                </div>
            )}

            {/* FAB - Adjusted position for desktop */}
            <button
                className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-40 bg-foreground text-background p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
                aria-label="Add Item"
            >
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>
    );
}
