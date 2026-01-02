import LoginButton from "@/components/auth/LoginButton";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen">
            {/* Left Side - Login */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-background p-8 md:p-12 relative z-10">
                <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Wishlist 2.0
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Curate, Share, and Discover your next obsession.
                        </p>
                    </div>

                    <div className="space-y-4 pt-8">
                        <LoginButton />
                        <p className="text-xs text-muted-foreground text-center md:text-left">
                            By continuing, you agree to our Terms and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block md:w-1/2 relative bg-muted">
                <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=2070"
                    alt="Login Splash"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Overlay for better contrast if text were over it */}
            </div>
        </div>
    );
}
