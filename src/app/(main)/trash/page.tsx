import { WishlistGrid } from "@/components/wishlist/WishlistGrid";
import { Trash2, Database } from "lucide-react";
import { getWishlistItems } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

// Async Server Component
export default async function TrashPage() {
    const allItems = await getWishlistItems();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // FILTER: Show items that are "Archived"
    const trashItems = allItems.filter(item => item.status === "Archived");

    const isEmpty = trashItems.length === 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <Trash2 className="text-destructive" size={24} />
                <h1 className="text-2xl font-bold tracking-tight text-destructive">Trash</h1>
            </div>

            {!isEmpty ? (
                <WishlistGrid items={trashItems} currentUser={user} isArchiveView={true} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-border rounded-xl bg-card/30">
                    <div className="p-4 bg-muted rounded-full">
                        <Trash2 size={32} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-foreground">Trash is Empty</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Items you discard will appear here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
