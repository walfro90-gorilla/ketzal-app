'use client'

import { useEffect, useState, useRef } from 'react';
import { useSession } from '@/lib/auth/client';

/**
 * Hook personalizado que espera a que NextAuth termine la hidrataciÃ³n
 * antes de reportar que la sesiÃ³n estÃ¡ lista.
 * 
 * Esto resuelve el problema de timing donde el WalletContext
 * recibe status 'unauthenticated' temporalmente despuÃ©s del login.
 */
export const useSessionReady = () => {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const previousStatus = useRef<string>('loading');
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    // Marcar que hemos pasado por al menos un ciclo de hidrataciÃ³n
    if (status !== 'loading' && !hasHydrated) {
      setHasHydrated(true);
    }

    // Detectar cuando acaba de hacer login
    if (previousStatus.current === 'unauthenticated' && status === 'authenticated') {
      console.log('ðŸŽ‰ useSessionReady: Login detected!');
      setJustLoggedIn(true);
      // Reset flag despuÃ©s de un tiempo
      setTimeout(() => setJustLoggedIn(false), 1000);
    }

    // La sesiÃ³n estÃ¡ "ready" cuando:
    // 1. NextAuth ha terminado de cargar (status !== 'loading')
    // 2. Y hemos pasado por al menos un ciclo de hidrataciÃ³n
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
