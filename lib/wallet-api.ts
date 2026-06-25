// Wallet API functions (stubs — backend real pendiente Fase 4+).
// Signatures alineadas con context/WalletContext.tsx para que el typecheck pase.
import { Wallet, WalletTransaction, AddFundsRequest, TransferRequest, ConvertCurrencyRequest } from '@/types/wallet';

type WalletResult = { success: boolean; wallet?: Wallet; message?: string };
type TxPagination = { total: number; limit: number; offset: number; hasMore: boolean };
type TxResult = { success: boolean; transactions?: WalletTransaction[]; pagination?: TxPagination; message?: string };

export const getWallet = async (userId: string): Promise<{ success: boolean; wallet?: Wallet; message?: string }> => {
  try {
    const res = await fetch(`/api/wallet?userId=${userId}`);
    return await res.json();
  } catch {
    return { success: false, message: 'Error al conectar con la API de wallet' };
  }
};

export const addFunds = async (userId: string, request: AddFundsRequest): Promise<WalletResult> => {
  console.log('Adding funds:', userId, request);
  return { success: true };
};

export const transferFunds = async (userId: string, request: TransferRequest): Promise<WalletResult> => {
  console.log('Transferring funds:', userId, request);
  return { success: true };
};

export const convertCurrency = async (userId: string, request: ConvertCurrencyRequest): Promise<WalletResult> => {
  console.log('Converting currency:', userId, request);
  return { success: true };
};

export const getTransactions = async (
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<TxResult> => {
  console.log('Getting transactions:', userId, limit, offset);
  return { success: true, transactions: [], pagination: { total: 0, limit, offset, hasMore: false } };
};
