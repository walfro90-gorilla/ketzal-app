'use client'

import React from 'react';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, TrendingUp, Gift } from 'lucide-react';

const WalletPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Monedero Ketzal</h1>
            <p className="text-gray-600">Gestiona tus fondos y transacciones de manera segura</p>
          </div>
        </div>
      </div>

      {/* Información destacada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <p className="text-sm text-gray-600">Transacciones seguras</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversión
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">1 MXN</div>
            <p className="text-sm text-gray-600">= 10 Axo Coins</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Recompensas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">5%</div>
            <p className="text-sm text-gray-600">Cashback en tours</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard principal */}
      <div className="max-w-4xl mx-auto">
        <WalletDashboard />
      </div>

      {/* Información de seguridad */}
      <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-blue-800 font-semibold mb-2">🔒 Tu dinero está seguro</div>
          <div className="text-blue-700 text-sm space-y-1">
            <p>Utilizamos encriptación de nivel bancario para proteger tus fondos.</p>
            <p>Todas las transacciones son monitoreadas 24/7 para detectar actividad sospechosa.</p>
            <p>Tus datos financieros nunca se comparten con terceros.</p>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">¿Qué son los Axo Coins?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              Los Axo Coins son nuestra moneda digital que te permite:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Obtener descuentos exclusivos en tours
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Recibir recompensas por referidos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Acceder a experiencias premium
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Participar en eventos especiales
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formas de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              Puedes agregar fondos a tu monedero usando:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Tarjetas de crédito y débito
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Transferencias bancarias
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                PayPal y otros métodos digitales
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Efectivo en tiendas afiliadas
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
