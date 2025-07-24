// Wallet API functions
import { Wallet, WalletTransaction, AddFundsRequest, TransferRequest, ConvertCurrencyRequest } from '@/types/wallet';

export const getWallet = async (userId: string): Promise<{ success: boolean; wallet?: Wallet; message?: string }> => {
  try {
    const res = await fetch(`/api/wallet?userId=${userId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Error al conectar con la API de wallet' };
  }
};

export const addFunds = async (request: AddFundsRequest): Promise<boolean> => {
  // Implementación temporal
  console.log('Adding funds:', request);
  return true;
};

export const transferFunds = async (request: TransferRequest): Promise<boolean> => {
  // Implementación temporal
  console.log('Transferring funds:', request);
  return true;
};

export const getTransactions = async (): Promise<WalletTransaction[]> => {
  // Implementación temporal
  return [];
};

export const convertCurrency = async (request: ConvertCurrencyRequest): Promise<boolean> => {
  // Implementación temporal
  console.log('Converting currency:', request);
  return true;
};
