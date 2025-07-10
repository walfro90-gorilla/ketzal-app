'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Wallet, WalletTransaction, AddFundsRequest, TransferRequest, ConvertCurrencyRequest } from '@/types/wallet';
import { getWallet, addFunds, transferFunds, getTransactions, convertCurrency } from '@/app/(protected)/wallet/wallet.api';
import { useAuthDetection } from '@/hooks/useAuthDetection';

// 🐛 DEBUGGING - Cambiar a true para activar logs detallados del wallet
const DEBUG_WALLET = false;

interface WalletContextType {
  // Estado
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Acciones básicas
  refreshWallet: () => Promise<void>;
  addFundsToWallet: (fundsData: AddFundsRequest) => Promise<boolean>;
  transferFundsFromWallet: (transferData: TransferRequest) => Promise<boolean>;
  convertCurrencyInWallet: (conversionData: ConvertCurrencyRequest) => Promise<boolean>;
  
  // Acciones de transacciones
  loadTransactions: (limit?: number, offset?: number) => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  
  // Utilidades
  hasInsufficientFunds: (amountMXN?: number, amountAxo?: number) => boolean;
  formatCurrency: (amount: number, currency: 'MXN' | 'AXO') => string;
  getExchangeRate: (from: 'MXN' | 'AXO', to: 'MXN' | 'AXO') => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  if (DEBUG_WALLET) console.log('🚀 WalletProvider: Component initializing...');
  
  const { isAuthenticated, isLoading: authLoading, detectionMethod, session, userId } = useAuthDetection();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [transactionsPagination, setTransactionsPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });

  // Log de autenticación en cada render (solo en debug)
  if (DEBUG_WALLET) {
    console.log('🔍 WalletProvider: Current auth state:', { 
      isAuthenticated,
      authLoading,
      detectionMethod,
      userId,
      hasSession: !!session,
      hasAttemptedLoad 
    });
  }

  // Tasas de cambio (podrían venir de una API)
  const EXCHANGE_RATES = {
    MXN_TO_AXO: 0.8, // 20% descuento
    AXO_TO_MXN: 1.1   // 10% premium
  };

  // Cargar wallet inicial
  const refreshWalletRef = React.useRef<(() => Promise<void>) | null>(null);
  
  const refreshWallet = async (): Promise<void> => {
    // Verificar que tenemos una sesión válida y autenticada
    if (!userId || !isAuthenticated) {
      if (DEBUG_WALLET) {
        console.log('❌ Session not ready for wallet loading:', { 
          userId, 
          isAuthenticated,
          detectionMethod
        });
      }
      return;
    }
    
    if (DEBUG_WALLET) console.log('🔄 Starting wallet refresh for user:', userId);
    setIsLoading(true);
    setError(null);
    setHasAttemptedLoad(true);
    
    try {
      if (DEBUG_WALLET) console.log('📡 Fetching wallet from API...');
      const response = await getWallet(userId);
      if (DEBUG_WALLET) console.log('📡 Wallet API response:', response);
      
      if (response.success && response.wallet) {
        setWallet(response.wallet);
        setIsInitialized(true);
        if (DEBUG_WALLET) {
          console.log('✅ Wallet loaded successfully:', {
            balanceMXN: response.wallet.balanceMXN,
            balanceAxo: response.wallet.balanceAxo,
            transactionCount: response.wallet.transactions?.length || 0
          });
        }
        
        // Si el wallet incluye transacciones recientes, las cargamos
        if (response.wallet.transactions) {
          setTransactions(response.wallet.transactions);
        }
      } else {
        setError(response.message || 'Error al cargar wallet');
        if (DEBUG_WALLET) console.error('❌ Wallet loading failed:', response);
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      if (DEBUG_WALLET) console.error('❌ Error refreshing wallet:', error);
    } finally {
      setIsLoading(false);
      if (DEBUG_WALLET) console.log('🏁 Wallet refresh completed');
    }
  };

  refreshWalletRef.current = refreshWallet;

  // Efecto para cargar el wallet cuando la autenticación esté lista
  useEffect(() => {
    if (DEBUG_WALLET) {
      console.log('🔄 Auth state changed:', { 
        isAuthenticated,
        authLoading,
        detectionMethod,
        userId, 
        isInitialized,
        hasAttemptedLoad,
        hasRefreshFunction: !!refreshWalletRef.current
      });
    }
    
    // Esperamos hasta que la detección de autenticación termine
    if (authLoading) {
      if (DEBUG_WALLET) console.log('⏳ Waiting for auth detection to complete...');
      return;
    }
    
    // Si está autenticado y tenemos usuario, cargar wallet
    if (isAuthenticated && userId && !isInitialized && !hasAttemptedLoad && refreshWalletRef.current) {
      if (DEBUG_WALLET) console.log('🚀 Auth ready! Attempting to load wallet for user:', userId);
      
      // Agregamos un timeout para evitar que se quede cargando indefinidamente
      const timeoutId = setTimeout(() => {
        if (!isInitialized) {
          console.log('⏰ Wallet loading timeout - forcing error state');
          setError('Timeout al cargar wallet. Por favor, recarga la página.');
          setIsLoading(false);
        }
      }, 10000); // 10 segundos de timeout
      
      refreshWalletRef.current().finally(() => {
        clearTimeout(timeoutId);
      });
    } else {
      if (DEBUG_WALLET) {
        console.log('❌ Not loading wallet because:', {
          authLoading,
          isAuthenticated,
          hasUserId: !!userId,
          isNotInitialized: !isInitialized,
          hasNotAttempted: !hasAttemptedLoad,
          hasRefreshFunction: !!refreshWalletRef.current
        });
      }
    }
    
    // Limpiar el estado si el usuario se desloguea
    if (!authLoading && !isAuthenticated) {
      setWallet(null);
      setTransactions([]);
      setIsInitialized(false);
      setHasAttemptedLoad(false);
      setError(null);
      if (DEBUG_WALLET) console.log('🧹 User logged out, clearing wallet state');
    }
  }, [isAuthenticated, authLoading, detectionMethod, userId, isInitialized, hasAttemptedLoad]);

  // Efecto adicional para manejar cambios en la sesión después de la inicialización
  useEffect(() => {
    if (isAuthenticated && userId && isInitialized && wallet?.userId !== userId) {
      // El usuario cambió, necesitamos recargar
      if (DEBUG_WALLET) {
        console.log('👤 User changed, reloading wallet...', {
          currentWalletUserId: wallet?.userId,
          newUserId: userId
        });
      }
      setIsInitialized(false);
      setHasAttemptedLoad(false);
      refreshWalletRef.current?.();
    }
  }, [userId, wallet?.userId, isAuthenticated, isInitialized]);

  const addFundsToWallet = async (fundsData: AddFundsRequest): Promise<boolean> => {
    if (!userId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await addFunds(userId, fundsData);
      
      if (response.success && response.wallet) {
        setWallet(response.wallet);
        // Recargar transacciones para mostrar la nueva
        await loadTransactions();
        return true;
      } else {
        setError(response.message || 'Error al agregar fondos');
        return false;
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error adding funds:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const transferFundsFromWallet = async (transferData: TransferRequest): Promise<boolean> => {
    if (!userId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await transferFunds(userId, transferData);
      
      if (response.success && response.wallet) {
        setWallet(response.wallet);
        await loadTransactions();
        return true;
      } else {
        setError(response.message || 'Error al transferir fondos');
        return false;
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error transferring funds:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const convertCurrencyInWallet = async (conversionData: ConvertCurrencyRequest): Promise<boolean> => {
    if (!userId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await convertCurrency(userId, conversionData);
      
      if (response.success && response.wallet) {
        setWallet(response.wallet);
        await loadTransactions();
        return true;
      } else {
        setError(response.message || 'Error al convertir moneda');
        return false;
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error converting currency:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async (limit: number = 20, offset: number = 0): Promise<void> => {
    if (!userId) return;
    
    try {
      const response = await getTransactions(userId, limit, offset);
      
      if (response.success && response.transactions) {
        if (offset === 0) {
          setTransactions(response.transactions);
        } else {
          setTransactions(prev => [...prev, ...response.transactions!]);
        }
        
        if (response.pagination) {
          setTransactionsPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadMoreTransactions = async (): Promise<void> => {
    if (!transactionsPagination.hasMore) return;
    
    const newOffset = transactionsPagination.offset + transactionsPagination.limit;
    await loadTransactions(transactionsPagination.limit, newOffset);
  };

  const hasInsufficientFunds = (amountMXN?: number, amountAxo?: number): boolean => {
    if (!wallet) return true;
    
    if (amountMXN && wallet.balanceMXN < amountMXN) return true;
    if (amountAxo && wallet.balanceAxo < amountAxo) return true;
    
    return false;
  };

  const formatCurrency = (amount: number, currency: 'MXN' | 'AXO'): string => {
    if (currency === 'MXN') {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(amount);
    } else {
      return `${amount.toFixed(2)} AXO`;
    }
  };

  const getExchangeRate = (from: 'MXN' | 'AXO', to: 'MXN' | 'AXO'): number => {
    if (from === to) return 1;
    if (from === 'MXN' && to === 'AXO') return EXCHANGE_RATES.MXN_TO_AXO;
    if (from === 'AXO' && to === 'MXN') return EXCHANGE_RATES.AXO_TO_MXN;
    return 1;
  };

  const value: WalletContextType = {
    // Estado
    wallet,
    transactions,
    isLoading,
    isInitialized,
    error,
    
    // Acciones básicas
    refreshWallet,
    addFundsToWallet,
    transferFundsFromWallet,
    convertCurrencyInWallet,
    
    // Acciones de transacciones
    loadTransactions,
    loadMoreTransactions,
    
    // Utilidades
    hasInsufficientFunds,
    formatCurrency,
    getExchangeRate
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
