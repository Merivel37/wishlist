"use server";

import { updateItemStatus } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function tagItem(itemId: string, action: "keep" | "pass") {
    // Map Swipe Action to Sheet Status
    // Pass -> "Archived" (so it hopefully gets filtered out or just tagged)
    // Keep -> "Active" (or maybe distinct "Saved"?)

    // User Request:
    // Left (X) -> Tag as 'Archived'
    // Right (Heart) -> Tag as 'Active'

    const newStatus = action === "pass" ? "Archived" : "Active";

    console.log(`Server Action: Tagging item ${itemId} as ${newStatus}`);

    const success = await updateItemStatus(itemId, newStatus);

    if (success) {
        // Revalidate to reflect changes if necessary
        revalidatePath("/wishlist");
        revalidatePath("/surprise-me");
    }

    return success;
}
