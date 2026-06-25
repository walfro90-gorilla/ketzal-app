'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// useSearchParams() necesita un Suspense boundary para prerender en Next 15.
function LoginInner() {
    const searchParams = useSearchParams();
    const isVerified = searchParams?.get('verified') === 'true';
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/');
        }
    }, [status, router]);

    if (status === 'authenticated') return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
            <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
            <LoginForm isVerified={isVerified} />
            {isVerified && (
                <p className="mt-2 text-green-600">¡Tu cuenta ha sido verificada!</p>
            )}
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginInner />
        </Suspense>
    );
}
