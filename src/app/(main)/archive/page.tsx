import { WishlistGrid } from "@/components/wishlist/WishlistGrid";
import { Archive, Database, AlertCircle } from "lucide-react";
import { getWishlistItems } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

// Async Server Component
export default async function ArchivePage() {
    const allItems = await getWishlistItems();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // FILTER: Show items that are "Archived" OR "Purchased"
    const archivedItems = allItems.filter(item =>
        item.status === "Archived" || item.purchaseStatus === "Purchased"
    );

    const isEmpty = archivedItems.length === 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <Archive className="text-muted-foreground" size={24} />
                <h1 className="text-2xl font-bold tracking-tight">Archive</h1>
            </div>

            {!isEmpty ? (
                <WishlistGrid items={archivedItems} currentUser={user} isArchiveView={true} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-border rounded-xl bg-card/30">
                    <div className="p-4 bg-muted rounded-full">
                        <Archive size={32} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-foreground">Archive is Empty</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Items you purchase or remove from your wishlist will appear here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
