// Wallet API functions (temporal implementation)
import { Wallet, WalletTransaction, AddFundsRequest, TransferRequest, ConvertCurrencyRequest } from '@/types/wallet';

export const getWallet = async (): Promise<Wallet> => {
  // Implementación temporal
  return {
    id: '1',
    userId: '1',
    mxnBalance: 0,
    axoBalance: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
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
