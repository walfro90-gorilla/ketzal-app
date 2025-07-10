'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

// 🐛 DEBUGGING - Cambiar a true para activar logs detallados de autenticación
const DEBUG_AUTH = false;

/**
 * Hook que detecta autenticación basándose en múltiples señales:
 * 1. useSession de NextAuth
 * 2. Si el usuario puede acceder a rutas protegidas (no redirigido a login)
 * 3. Headers del servidor
 */
export const useAuthDetection = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detectionMethod, setDetectionMethod] = useState<string>('');
  const [sessionData, setSessionData] = useState<typeof session | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const detectAuth = async () => {
      if (DEBUG_AUTH) {
        console.log('🕵️ AuthDetection: Starting detection...', {
          sessionStatus: status,
          sessionExists: !!session,
          pathname,
          userId: session?.user?.id
        });
      }

      // Método 1: Si useSession dice que está autenticado
      if (status === 'authenticated' && session?.user?.id) {
        if (DEBUG_AUTH) console.log('✅ AuthDetection: Detected via useSession');
        setIsAuthenticated(true);
        setDetectionMethod('useSession');
        setSessionData(session);
        setUserId(session.user.id);
        setIsLoading(false);
        return;
      }

      // Método 2: Si estamos en una ruta protegida y no fuimos redirigidos
      const protectedRoutes = ['/wallet', '/services', '/suppliers', '/users', '/products'];
      const isOnProtectedRoute = pathname ? protectedRoutes.some(route => pathname.startsWith(route)) : false;
      
      if (isOnProtectedRoute && status !== 'loading') {
        if (DEBUG_AUTH) console.log('🚀 AuthDetection: On protected route, fetching session data...');
        
        // Intentar obtener los datos de usuario del endpoint
        try {
          const response = await fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (DEBUG_AUTH) console.log('📡 AuthDetection: Session endpoint status:', response.status);
          
          if (response.ok) {
            const fetchedSessionData = await response.json();
            if (DEBUG_AUTH) console.log('📡 AuthDetection: Session endpoint response:', fetchedSessionData);
            
            if (fetchedSessionData?.user?.id) {
              if (DEBUG_AUTH) console.log('✅ AuthDetection: Got complete session data');
              setIsAuthenticated(true);
              setDetectionMethod('protectedRoute+sessionEndpoint');
              setSessionData(fetchedSessionData);
              setUserId(fetchedSessionData.user.id);
              setIsLoading(false);
              return;
            }
          }
          
          if (DEBUG_AUTH) console.log('⚠️ AuthDetection: Session endpoint returned no user data');
        } catch (error) {
          if (DEBUG_AUTH) console.error('❌ AuthDetection: Error fetching session data:', error);
        }
        
        // Si estamos en ruta protegida pero no pudimos obtener datos de usuario
        if (DEBUG_AUTH) console.log('⚠️ AuthDetection: Authenticated via protected route but no user data');
        setIsAuthenticated(true);
        setDetectionMethod('protectedRoute');
        setSessionData(null);
        setUserId(undefined);
        setIsLoading(false);
        return;
      }

      // Si llegamos aquí y el status no es loading, no estamos autenticados
      if (status !== 'loading') {
        if (DEBUG_AUTH) console.log('❌ AuthDetection: Not authenticated');
        setIsAuthenticated(false);
        setDetectionMethod('none');
        setSessionData(null);
        setUserId(undefined);
        setIsLoading(false);
      }
    };

    detectAuth();
  }, [status, session, pathname]);

  return {
    isAuthenticated,
    isLoading,
    detectionMethod,
    session: sessionData || session,
    status: isAuthenticated ? 'authenticated' : status,
    userId
  };
};
