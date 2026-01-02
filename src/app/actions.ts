"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function tagItem(itemId: string, action: "keep" | "pass") {
    // Map Swipe Action to Sheet Status
    // Pass -> "Archived" (so it hopefully gets filtered out or just tagged)
    // Keep -> "Active" (or maybe distinct "Saved"?)

    // User Request:
    // Left (X) -> Tag as 'Archived'
    // Right (Heart) -> Tag as 'Active'
    const supabase = await createClient();

    const newStatus = action === "pass" ? "Archived" : "Active";

    console.log(`Server Action: Tagging item ${itemId} as ${newStatus}`);

    // Using Supabase directly here instead of lib helper to ensure we use the server client with cookies if needed,
    // though the helper was refactored. Let's use the helper if we can, or direct.
    // Actually, I refactored `updateItemStatus` in lib/supabase.ts to use `createClient` from server.
    // So let's just use that helper? 
    // Wait, `updateItemStatus` only updates status.
    // I need `claimItem` which updates `claimed_user`.

    // Let's implement directly here for simplicity and power.
    const { error } = await supabase
        .from("The Wish List")
        .update({ status: newStatus })
        .eq("product_id", itemId);

    if (!error) {
        revalidatePath("/wishlist");
        revalidatePath("/surprise-me");
        return true;
    }
    console.error("Error tagging item:", error);
    return false;
}

export async function claimItem(itemId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        console.error("Unauthorized claim attempt");
        return false;
    }

    console.log(`Server Action: User ${user.email} claiming item ${itemId}`);

    const { error } = await supabase
        .from("The Wish List")
        .update({
            claimed_user: user.email,
            // Optionally set purchase_status?
            // purchase_status: "Reserved"? 
            // User requirement: "Store the logged-in user's email in 'claimed_user' column"
        })
        .eq("product_id", itemId);

    if (!error) {
        revalidatePath("/wishlist");
        return true;
    }

    console.error("Error claiming item:", error);
    return false;
}
