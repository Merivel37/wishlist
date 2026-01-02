import { getWishlistItems } from "@/lib/supabase";
import SurpriseMeClient from "./SurpriseMeClient";

export default async function SurpriseMePage() {
    const items = await getWishlistItems();

    // Filter for only Active/Fresh items if needed, or pass all
    return <SurpriseMeClient initialItems={items} />;
}
