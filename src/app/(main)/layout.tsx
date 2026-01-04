import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar user={user} className="hidden md:flex w-64 border-r border-border h-screen sticky top-0" />

            <div className="flex-1 flex flex-col min-h-screen relative">
                <Header user={user} className="md:hidden" />
                <main className="flex-1 px-4 pt-16 md:pt-8 md:px-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
                <Footer />
                <BottomNav className="md:hidden" />
            </div>
        </div>
    );
}
