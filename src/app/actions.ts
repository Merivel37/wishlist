"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function tagItem(itemId: string, action: "keep" | "pass") {
    const supabase = await createClient();
    const newStatus = action === "pass" ? "Archived" : "Active";

    const { error } = await supabase
        .from("The Wish List")
        .update({ status: newStatus })
        .eq("product_id", itemId);

    if (!error) {
        revalidatePath("/wishlist");
        revalidatePath("/surprise-me");
        revalidatePath("/archive");
        revalidatePath("/trash");
        return true;
    }
    return false;
}

export async function claimItem(itemId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) return false;

    const { error } = await supabase
        .from("The Wish List")
        .update({ claimed_user: user.email })
        .eq("product_id", itemId);

    if (!error) {
        revalidatePath("/wishlist");
        return true;
    }
    return false;
}

// NEW: Unclaim Item
export async function unclaimItem(itemId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("The Wish List")
        .update({ claimed_user: null }) // Set to NULL to unclaim
        .eq("product_id", itemId);

    if (!error) {
        revalidatePath("/wishlist");
        return true;
    }
    return false;
}

export async function updateStatus(itemId: string, updates: { status?: "Active" | "Archived"; purchaseStatus?: string }) {
    const supabase = await createClient();
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.purchaseStatus) dbUpdates.purchase_status = updates.purchaseStatus;

    const { error } = await supabase
        .from("The Wish List")
        .update(dbUpdates)
        .eq("product_id", itemId);

    if (!error) {
        revalidatePath("/wishlist");
        revalidatePath("/archive");
        revalidatePath("/trash");
        return true;
    }
    return false;
}

export async function updateItemTitle(itemId: string, newTitle: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("The Wish List")
        .update({ item: newTitle })
        .eq("product_id", itemId);

    if (!error) {
        revalidatePath("/wishlist");
        revalidatePath("/archive");
        revalidatePath("/trash");
        return true;
    }
    return false;
}
