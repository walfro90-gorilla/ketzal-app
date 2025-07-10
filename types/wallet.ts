// Tipos para el wallet
export interface WalletTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PURCHASE' | 'REFUND' | 'TRANSFER_SENT' | 'TRANSFER_RECEIVED' | 'REWARD';
  amountMXN?: number;
  amountAxo?: number;
  description: string;
  reference?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balanceMXN: number;
  balanceAxo: number;
  createdAt: string;
  updatedAt: string;
  transactions?: WalletTransaction[];
}

export interface AddFundsRequest {
  amountMXN?: number;
  amountAxo?: number;
  description?: string;
  paymentMethod?: string;
}

export interface TransferRequest {
  recipientEmail: string;
  amountMXN?: number;
  amountAxo?: number;
  description?: string;
}

export interface ConvertCurrencyRequest {
  fromCurrency: 'MXN' | 'AXO';
  toCurrency: 'MXN' | 'AXO';
  amount: number;
}

export interface ConversionResult {
  wallet: Wallet;
  conversion: {
    from: { currency: string; amount: number };
    to: { currency: string; amount: number };
    rate: number;
  };
}
