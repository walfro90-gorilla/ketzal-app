const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

import { 
  Wallet, 
  AddFundsRequest, 
  TransferRequest, 
  ConvertCurrencyRequest,
  WalletTransaction 
} from '@/types/wallet';

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface ConversionInfo {
  from: { currency: string; amount: number };
  to: { currency: string; amount: number };
  rate: number;
}

// Obtener wallet del usuario
export const getWallet = async (userId: string): Promise<{ success: boolean; wallet?: Wallet; message?: string }> => {
  try {
    console.log('Fetching wallet for user:', userId);
    const response = await fetch(`${BACKEND_URL}/api/wallet/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Wallet API response status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('Wallet API response data:', data);
    
    if (!response.ok) {
      console.error('Wallet API request failed:', data);
      throw new Error(data.message || 'Error al obtener wallet');
    }

    return data;
  } catch (error) {
    console.error('Error in getWallet:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Agregar fondos al wallet
export const addFunds = async (
  userId: string, 
  fundsData: AddFundsRequest
): Promise<{ success: boolean; wallet?: Wallet; message?: string }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/wallet/${userId}/add-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fundsData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al agregar fondos');
    }

    return data;
  } catch (error) {
    console.error('Error in addFunds:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Transferir fondos
export const transferFunds = async (
  userId: string, 
  transferData: TransferRequest
): Promise<{ success: boolean; wallet?: Wallet; message?: string }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/wallet/${userId}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transferData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al transferir fondos');
    }

    return data;
  } catch (error) {
    console.error('Error in transferFunds:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Obtener historial de transacciones
export const getTransactions = async (
  userId: string, 
  limit: number = 20, 
  offset: number = 0
): Promise<{ 
  success: boolean; 
  transactions?: WalletTransaction[]; 
  pagination?: PaginationInfo; 
  message?: string 
}> => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/wallet/${userId}/transactions?limit=${limit}&offset=${offset}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener transacciones');
    }

    return data;
  } catch (error) {
    console.error('Error in getTransactions:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Convertir moneda
export const convertCurrency = async (
  userId: string, 
  conversionData: ConvertCurrencyRequest
): Promise<{ success: boolean; wallet?: Wallet; conversion?: ConversionInfo; message?: string }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/wallet/${userId}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conversionData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al convertir moneda');
    }

    return data;
  } catch (error) {
    console.error('Error in convertCurrency:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
