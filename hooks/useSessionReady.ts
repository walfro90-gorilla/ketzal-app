'use client'

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook personalizado que espera a que NextAuth termine la hidratación
 * antes de reportar que la sesión está lista.
 * 
 * Esto resuelve el problema de timing donde el WalletContext
 * recibe status 'unauthenticated' temporalmente después del login.
 */
export const useSessionReady = () => {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const previousStatus = useRef<string>('loading');
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    // Marcar que hemos pasado por al menos un ciclo de hidratación
    if (status !== 'loading' && !hasHydrated) {
      setHasHydrated(true);
    }

    // Detectar cuando acaba de hacer login
    if (previousStatus.current === 'unauthenticated' && status === 'authenticated') {
      console.log('🎉 useSessionReady: Login detected!');
      setJustLoggedIn(true);
      // Reset flag después de un tiempo
      setTimeout(() => setJustLoggedIn(false), 1000);
    }

    // La sesión está "ready" cuando:
    // 1. NextAuth ha terminado de cargar (status !== 'loading')
    // 2. Y hemos pasado por al menos un ciclo de hidratación
    if (status !== 'loading' && hasHydrated) {
      setIsReady(true);
    }

    previousStatus.current = status;
  }, [status, hasHydrated]);

  return {
    session,
    status,
    isReady,
    justLoggedIn,
    isAuthenticated: status === 'authenticated' && !!session?.user?.id,
    isLoading: status === 'loading' || !isReady
  };
};
