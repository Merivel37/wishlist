import { createClient } from "@supabase/supabase-js";
import { WishlistItem, Freshness } from "@/types/schema";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const mapPriorityToFreshness = (priority: number): Freshness => {
    if (priority <= 2) return "Hot";
    if (priority === 3) return "Warm";
    return "Cold";
};

export const getWishlistItems = async (): Promise<WishlistItem[]> => {
    try {
        const { data, error } = await supabase
            .from("The Wish List")
            .select("*");

        if (error) {
            console.error("Supabase Fetch Error:", error);
            throw error;
        }

        if (!data) return [];

        return data.map((row: any) => {
            const isActive = row.status?.toLowerCase() === "active";
            // Logic: purchase_status preferred, else fallback to status column
            const purchaseStatus = row.purchase_status || (isActive ? "Active" : "Inactive");

            return {
                id: row.product_id?.toString() || `supa-${Math.random()}`,
                name: row.item || "Unknown Item", // Mapped from 'item'
                description: row.description || "",
                photoUrl: row.source_images || "", // Mapped from 'source_images'
                price: typeof row.price === 'string' ? parseFloat(row.price.replace(/[£$]/g, "")) : (row.price || 0),
                currency: "£",
                storeLink: row.links || "", // Mapped from 'links'
                usage: "",
                freshness: mapPriorityToFreshness(Number(row.freshness) || 3), // Mapped from 'freshness' (1-5)
                createdAt: row.timestamp || new Date().toISOString(),
                brand: row.brand || "",
                purchaseStatus: purchaseStatus,
                claimedBy: row.claimed_user || "",
                category: row.section || "General",
                isClaimed: !!row.claimed_user,
            };
        });
    } catch (err) {
        console.error("Error in getWishlistItems:", err);
        return [];
    }
};

export const updateItemStatus = async (itemKey: string, newStatus: string) => {
    try {
        // We assume itemKey is the product_id (string) or a fallback ID.
        // If it starts with "supa-", we can't really update it reliably unless we have the real ID.
        // But let's assume valid product_ids.

        // Also user requested: "Update status, claimed_user, purchase_status when user interacts"
        // For now, this function handles STATUS (Archive/Active logic).

        // We will update the 'status' column.
        const { error } = await supabase
            .from("The Wish List")
            .update({ status: newStatus })
            .eq("product_id", itemKey);

        if (error) {
            console.error("Supabase Update Error:", error);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Error in updateItemStatus:", err);
        return false;
    }
};
