'use client'

import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button' - Removed invalid import
import { LogIn } from 'lucide-react'

// Basic fallback button if UI component is missing
const BaseButton = ({ children, onClick, className }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity ${className}`}
    >
        {children}
    </button>
)

export default function LoginButton() {
    const handleLogin = async () => {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error("Login failed:", error.message)
        }
    }

    return (
        <BaseButton onClick={handleLogin}>
            <LogIn size={16} />
            <span>Sign in with Google</span>
        </BaseButton>
    )
}
