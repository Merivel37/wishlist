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
    status?: "Active" | "Archived";
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

export type MediaType = 'book' | 'movie' | 'tv';
export type MediaStatus = 'queued' | 'reading' | 'watching' | 'finished';

export interface MediaItem {
    id: string;
    title: string;
    type: MediaType;
    status: MediaStatus;
    url?: string;
    image?: string; // Cover image URL
    tags?: string[];
    rating?: number; // 1-5 or 1-10
    review?: string;
    createdAt: string;
}

export interface Restaurant {
    id: string;
    name: string;
    location?: string;
    cuisine?: string;
    priceRange?: string;
    rating?: number;
    review?: string;
    bookingUrl?: string;
    status: 'wishlist' | 'visited' | 'favorite';
    tags?: string[];
    imageUrl?: string;
    createdAt: string;
}

export interface Recipe {
    id: string;
    title: string;
    ingredients?: { item: string; amount?: string }[];
    method?: string;
    imageUrl?: string;
    sourceUrl?: string;
    rating?: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    createdAt: string;
}
