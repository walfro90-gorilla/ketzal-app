'use client'

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import { 
  History, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ShoppingCart, 
  RotateCcw,
  Send,
  ArrowDown,
  Gift
} from 'lucide-react';
import { WalletTransaction } from '@/types/wallet';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ isOpen, onClose }) => {
  const { transactions, isLoading, loadTransactions, loadMoreTransactions, formatCurrency } = useWallet();

  useEffect(() => {
    if (isOpen && transactions.length === 0) {
      loadTransactions();
    }
  }, [isOpen, transactions.length, loadTransactions]);

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpCircle className="h-4 w-4 text-green-600" />;
      case 'WITHDRAWAL':
        return <ArrowDownCircle className="h-4 w-4 text-red-600" />;
      case 'PURCHASE':
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'REFUND':
        return <RotateCcw className="h-4 w-4 text-orange-600" />;
      case 'TRANSFER_SENT':
        return <Send className="h-4 w-4 text-purple-600" />;
      case 'TRANSFER_RECEIVED':
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      case 'REWARD':
        return <Gift className="h-4 w-4 text-yellow-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_RECEIVED':
      case 'REFUND':
      case 'REWARD':
        return 'text-green-600';
      case 'WITHDRAWAL':
      case 'PURCHASE':
      case 'TRANSFER_SENT':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionTypeLabel = (type: WalletTransaction['type']) => {
    const labels = {
      DEPOSIT: 'Depósito',
      WITHDRAWAL: 'Retiro',
      PURCHASE: 'Compra',
      REFUND: 'Reembolso',
      TRANSFER_SENT: 'Transferencia Enviada',
      TRANSFER_RECEIVED: 'Transferencia Recibida',
      REWARD: 'Recompensa'
    };
    return labels[type] || type;
  };

  const formatTransactionAmount = (transaction: WalletTransaction) => {
    // Para transferencias enviadas, los montos vienen negativos del backend
    // Necesitamos mostrar el valor absoluto
    if (transaction.amountMXN && transaction.amountMXN !== 0) {
      const amount = Math.abs(transaction.amountMXN);
      return formatCurrency(amount, 'MXN');
    }
    if (transaction.amountAxo && transaction.amountAxo !== 0) {
      const amount = Math.abs(transaction.amountAxo);
      return formatCurrency(amount, 'AXO');
    }
    return 'N/A';
  };

  const getAmountSign = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_RECEIVED':
      case 'REFUND':
      case 'REWARD':
        return '+';
      case 'WITHDRAWAL':
      case 'PURCHASE':
      case 'TRANSFER_SENT':
        return '-';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Transacciones
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading && transactions.length === 0 ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <Card className="h-48 flex items-center justify-center">
              <CardContent className="text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <div className="text-gray-600 font-medium">No hay transacciones</div>
                <div className="text-gray-500 text-sm">
                  Las transacciones aparecerán aquí cuando realices alguna actividad
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">
                            {transaction.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className="text-xs"
                            >
                              {getTransactionTypeLabel(transaction.type)}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleString('es-MX', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          {transaction.reference && (
                            <div className="text-xs text-gray-400 mt-1">
                              Ref: {transaction.reference}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {getAmountSign(transaction.type)}{formatTransactionAmount(transaction)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.amountMXN && transaction.amountMXN !== 0 ? 'MXN' : 'AXO'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Botón para cargar más transacciones */}
          {transactions.length > 0 && transactions.length % 10 === 0 && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={loadMoreTransactions}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? 'Cargando...' : 'Cargar más transacciones'}
              </Button>
            </div>
          )}
        </div>

        {/* Estadísticas rápidas */}
        {transactions.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-500">Total Transacciones</div>
                <div className="font-bold text-gray-900">{transactions.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Ingresos</div>
                <div className="font-bold text-green-600">
                  {transactions.filter(t => 
                    ['DEPOSIT', 'TRANSFER_RECEIVED', 'REFUND', 'REWARD'].includes(t.type)
                  ).length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Gastos</div>
                <div className="font-bold text-red-600">
                  {transactions.filter(t => 
                    ['WITHDRAWAL', 'PURCHASE', 'TRANSFER_SENT'].includes(t.type)
                  ).length}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionHistoryModal;
