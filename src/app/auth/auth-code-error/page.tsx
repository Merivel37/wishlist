import Link from "next/link";

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
            <p className="text-muted-foreground">
                We encountered an issue logging you in. The verification code may be invalid or expired.
            </p>
            <Link href="/login" className="underline hover:text-primary">
                Return to Login
            </Link>
        </div>
    );
}
