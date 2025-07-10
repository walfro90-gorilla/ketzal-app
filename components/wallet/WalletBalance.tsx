'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { Wallet, Plus, ArrowUpDown, History } from 'lucide-react';

interface WalletBalanceProps {
  onAddFunds?: () => void;
  onTransfer?: () => void;
  onViewHistory?: () => void;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  onAddFunds,
  onTransfer,
  onViewHistory
}) => {
  const { wallet, isLoading, formatCurrency } = useWallet();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Mi Monedero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="w-full max-w-md border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 font-medium">Error al cargar monedero</p>
            <p className="text-red-500 text-sm">Por favor, intenta nuevamente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Wallet className="h-5 w-5" />
          Mi Monedero Ketzal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balances */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Pesos Mexicanos</div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(wallet.balanceMXN, 'MXN')}
            </div>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              MXN
            </Badge>
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Axo Coins</div>
            <div className="text-lg font-bold text-purple-600">
              {formatCurrency(wallet.balanceAxo, 'AXO')}
            </div>
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
              AXO
            </Badge>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex gap-2">
          <Button 
            onClick={onAddFunds}
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
          
          <Button 
            onClick={onTransfer}
            size="sm" 
            variant="outline" 
            className="flex-1"
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            Transferir
          </Button>
        </div>

        {/* Botón de historial */}
        <Button 
          onClick={onViewHistory}
          variant="ghost" 
          size="sm" 
          className="w-full text-gray-600 hover:text-gray-800"
        >
          <History className="h-4 w-4 mr-2" />
          Ver historial de transacciones
        </Button>

        {/* Info de última actualización */}
        <div className="text-xs text-gray-400 text-center pt-2 border-t">
          Última actualización: {new Date(wallet.updatedAt).toLocaleString('es-MX')}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
