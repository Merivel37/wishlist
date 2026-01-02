import { ObsessionBubble } from "@/components/obsessions/ObsessionBubble";
import { BrandCloud } from "@/components/obsessions/BrandCloud";
import { Obsession } from "@/types/schema";

// Mock Data
const mockObsessions: Obsession[] = [
    { id: "1", name: "Japanese Craft", heat: 95, type: "Current" },
    { id: "2", name: "Wabi-Sabi", heat: 85, type: "Current" },
    { id: "3", name: "Tactical Gear", heat: 70, type: "Current" },
    { id: "4", name: "Alpine Kit", heat: 40, type: "Seasonal" },
    { id: "5", name: "Vintage Tools", heat: 30, type: "Past" },
    { id: "6", name: "Oaxacan Food", heat: 60, type: "Current" },
];

const mockBrands = [
    { name: "Snow Peak", heat: 90 },
    { name: "Leica", heat: 85 },
    { name: "Aesop", heat: 75 },
    { name: "Musto", heat: 60 },
    { name: "Rotring", heat: 55 },
    { name: "Muji", heat: 50 },
    { name: "Filson", heat: 45 },
    { name: "Fjällräven", heat: 40 },
];

export default function ObsessionsPage() {
    return (
        <div className="space-y-12 py-6 animate-in fade-in duration-700">

            {/* Obsessions Section */}
            <section>
                <h2 className="text-xl font-bold mb-6 tracking-tight text-center">Current Obsessions</h2>
                <div className="flex flex-wrap justify-center gap-4 items-center min-h-[300px]">
                    {mockObsessions.map(obsession => (
                        <ObsessionBubble key={obsession.id} obsession={obsession} />
                    ))}
                </div>
            </section>

            {/* Brand Heatmap Section */}
            <section>
                <h2 className="text-xl font-bold mb-6 tracking-tight text-center">Brand Heatmap</h2>
                <BrandCloud brands={mockBrands} />
            </section>

        </div>
    );
}
