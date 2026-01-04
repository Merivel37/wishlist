import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <p>merivel.ai copyright 2026</p>
                <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                    Privacy Policy
                </Link>
            </div>
            {/* Spacer for mobile bottom nav */}
            <div className="h-16 md:hidden" />
        </footer>
    );
}
