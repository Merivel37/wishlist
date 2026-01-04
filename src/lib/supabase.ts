import { createClient } from "@supabase/supabase-js";
import { WishlistItem, Freshness, MediaItem, Restaurant, Recipe } from "@/types/schema";

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

            // Robust Image Cleaning
            let cleanPhotoUrl = "";
            const rawImg = row.source_images;
            if (rawImg && typeof rawImg === 'string') {
                // If it's a comma separated string (e.g. multiple images), take the first one
                let firstUrl = rawImg.split(',')[0].trim();
                // Remove extra quotes if present
                firstUrl = firstUrl.replace(/^["']|["']$/g, '');

                if (firstUrl.startsWith('http')) {
                    cleanPhotoUrl = firstUrl;
                }
            }

            return {
                id: row.product_id?.toString() || `supa-${Math.random()}`,
                name: row.item || "Untitled Item", // Mapped from 'item'
                description: row.description || "",
                photoUrl: cleanPhotoUrl, // Mapped from 'source_images'
                price: typeof row.price === 'string' ? parseFloat(row.price.replace(/[£$]/g, "")) : (row.price || 0),
                currency: "£",
                storeLink: row.links || "", // Mapped from 'links'
                usage: "",
                freshness: mapPriorityToFreshness(Number(row.freshness) || 3), // Mapped from 'freshness' (1-5)
                createdAt: row.timestamp || new Date().toISOString(),
                brand: row.brand || "",
                status: row.status === "Archived" ? "Archived" : "Active",
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

export const getMediaItems = async (): Promise<MediaItem[]> => {
    try {
        const { data, error } = await supabase
            .from("media_items")
            .select("*")
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Fetch Error (Media):", error);
            throw error;
        }

        if (!data) return [];

        return data.map((row: any) => ({
            id: row.id,
            title: row.title,
            type: row.type,
            status: row.status,
            url: row.url,
            image: row.image,
            tags: row.tags || [],
            rating: row.rating,
            review: row.review,
            createdAt: row.created_at,
        }));
    } catch (err) {
        console.error("Error in getMediaItems:", err);
        return [];
    }
};

export const addMediaItem = async (item: Partial<MediaItem>) => {
    try {
        const { error } = await supabase
            .from("media_items")
            .insert([{
                title: item.title,
                type: item.type,
                status: item.status || 'queued',
                url: item.url,
                image: item.image,
                tags: item.tags,
                rating: item.rating,
                review: item.review,
            }]);

        if (error) {
            console.error("Supabase Insert Error (Media):", error);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Error in addMediaItem:", err);
        return false;
    }
};

export const getRestaurants = async (): Promise<Restaurant[]> => {
    try {
        const { data, error } = await supabase.from("restaurants").select("*").order('created_at', { ascending: false });
        if (error) { console.error("Supabase Error (Restaurants):", error); throw error; }
        return data ? data.map((r: any) => ({ ...r, priceRange: r.price_range, imageUrl: r.image_url, bookingUrl: r.booking_url, createdAt: r.created_at })) : [];
    } catch (err) { return []; }
};

export const addRestaurant = async (item: Partial<Restaurant>) => {
    try {
        const { error } = await supabase.from("restaurants").insert([{
            name: item.name, location: item.location, cuisine: item.cuisine, price_range: item.priceRange, rating: item.rating, review: item.review, booking_url: item.bookingUrl, status: item.status || 'wishlist', tags: item.tags, image_url: item.imageUrl
        }]);
        if (error) { console.error("Supabase Insert Error:", error); return false; }
        return true;
    } catch (err) { return false; }
};

export const getRecipes = async (): Promise<Recipe[]> => {
    try {
        const { data, error } = await supabase.from("recipes").select("*").order('created_at', { ascending: false });
        if (error) { console.error("Supabase Error (Recipes):", error); throw error; }
        return data ? data.map((r: any) => ({ ...r, imageUrl: r.image_url, sourceUrl: r.source_url, createdAt: r.created_at })) : [];
    } catch (err) { return []; }
};

export const addRecipe = async (item: Partial<Recipe>) => {
    try {
        const { error } = await supabase.from("recipes").insert([{
            title: item.title, ingredients: item.ingredients, method: item.method, image_url: item.imageUrl, source_url: item.sourceUrl, rating: item.rating, difficulty: item.difficulty
        }]);
        if (error) { console.error("Supabase Insert Error:", error); return false; }
        return true;
    } catch (err) { return false; }
};
