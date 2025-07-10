'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import WalletBalance from './WalletBalance';
import AddFundsModal from './AddFundsModal';
import TransferFundsModal from './TransferFundsModal';
import TransactionHistoryModal from './TransactionHistoryModal';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface WalletDashboardProps {
  className?: string;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({ className }) => {
  console.log('🎯 WalletDashboard: Component rendering...');
  
  const { wallet, isLoading, isInitialized, error, refreshWallet } = useWallet();
  console.log('🎯 WalletDashboard: Wallet state:', { 
    hasWallet: !!wallet, 
    isLoading, 
    isInitialized, 
    error 
  });
  
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleRefresh = async () => {
    try {
      await refreshWallet();
    } catch (error) {
      console.error('Error al refrescar wallet:', error);
    }
  };

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-red-800">Error al cargar monedero</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <p className="text-red-500 text-xs mt-2">
                Si el problema persiste, verifica tu conexión o contacta soporte
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Cargando...' : 'Reintentar'}
              </Button>
              <div className="text-xs text-red-400">
                Presiona F5 para recargar toda la página si el problema persiste
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar loading mientras no esté inicializado o esté cargando sin wallet
  if (!isInitialized || (isLoading && !wallet)) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 text-blue-600 mx-auto animate-spin" />
            <div>
              <h3 className="font-semibold text-gray-800">Inicializando monedero...</h3>
              <p className="text-gray-600 text-sm">Configurando tu billetera digital</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Componente principal del balance */}
      <WalletBalance
        onAddFunds={() => setShowAddFunds(true)}
        onTransfer={() => setShowTransfer(true)}
        onViewHistory={() => setShowHistory(true)}
      />

      {/* Acciones rápidas adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              onClick={() => setShowAddFunds(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Agregar Fondos
            </Button>
            <Button 
              onClick={() => setShowTransfer(true)}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Transferir Dinero
            </Button>
            <Button 
              onClick={() => setShowHistory(true)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Ver Historial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4">
          <div className="text-sm space-y-2">
            <div className="font-semibold text-orange-800">💡 Consejos para usar tu monedero:</div>
            <ul className="text-orange-700 space-y-1 text-xs">
              <li>• Los Axo Coins se otorgan como recompensa por actividades en la plataforma</li>
              <li>• Puedes usar ambas monedas para pagar tours y experiencias</li>
              <li>• Las transferencias entre usuarios son instantáneas y gratuitas</li>
              <li>• Tu saldo está protegido con encriptación de nivel bancario</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <AddFundsModal 
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
      />

      <TransferFundsModal 
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
      />

      <TransactionHistoryModal 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default WalletDashboard;
