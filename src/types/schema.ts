export type Freshness = "Hot" | "Warm" | "Cold";

export interface WishlistItem {
    id: string;
    name: string;
    description: string;
    photoUrl: string;
    price: number;
    currency: string;
    storeLink: string;
    usage: string;
    freshness: Freshness;
    createdAt: string;
    brand?: string;
    purchaseStatus?: string;
    claimedBy?: string;
    category?: string;
    isClaimed?: boolean; // For family view
}

export interface Obsession {
    id: string;
    name: string;
    heat: number; // 0-100
    type: "Current" | "Past" | "Seasonal";
}
