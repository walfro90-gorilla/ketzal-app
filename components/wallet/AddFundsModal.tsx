'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useToast } from '@/components/use-toast';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ isOpen, onClose }) => {
  const { addFundsToWallet, isLoading } = useWallet();
  const { showToast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState<'MXN' | 'AXO'>('MXN');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const paymentMethods = [
    { value: 'credit_card', label: 'Tarjeta de Crédito', icon: CreditCard },
    { value: 'debit_card', label: 'Tarjeta de Débito', icon: CreditCard },
    { value: 'bank_transfer', label: 'Transferencia Bancaria', icon: Banknote },
    { value: 'oxxo', label: 'OXXO', icon: Smartphone },
    { value: 'spei', label: 'SPEI', icon: Banknote },
  ];

  const predefinedAmounts = selectedCurrency === 'MXN' 
    ? [100, 250, 500, 1000, 2000, 5000]
    : [10, 25, 50, 100, 250, 500];

  const handleAddFunds = async () => {
    if (!amount || !paymentMethod) {
      showToast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast({
        title: 'Error',
        description: 'Por favor ingresa un monto válido'
      });
      return;
    }

    try {
      const fundsData = {
        [selectedCurrency === 'MXN' ? 'amountMXN' : 'amountAxo']: numericAmount,
        description: description || `Recarga de ${selectedCurrency}`,
        paymentMethod
      };

      const success = await addFundsToWallet(fundsData);
      
      if (success) {
        showToast({
          title: 'Éxito',
          description: `¡Fondos agregados exitosamente! +${numericAmount} ${selectedCurrency}`
        });
        resetForm();
        onClose();
      } else {
        showToast({
          title: 'Error',
          description: 'Error al agregar fondos. Por favor intenta nuevamente.'
        });
      }
    } catch (error) {
      console.error('Error al agregar fondos:', error);
      showToast({
        title: 'Error',
        description: 'Error al procesar la transacción'
      });
    }
  };

  const resetForm = () => {
    setAmount('');
    setPaymentMethod('');
    setDescription('');
    setSelectedCurrency('MXN');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Agregar Fondos a tu Monedero
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selector de moneda */}
          <div className="space-y-2">
            <Label>Tipo de Moneda</Label>
            <Select value={selectedCurrency} onValueChange={(value: 'MXN' | 'AXO') => setSelectedCurrency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MXN">Pesos Mexicanos (MXN)</SelectItem>
                <SelectItem value="AXO">Axo Coins (AXO)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Montos predefinidos */}
          <div className="space-y-2">
            <Label>Montos Rápidos</Label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((predefinedAmount) => (
                <Button
                  key={predefinedAmount}
                  variant={amount === predefinedAmount.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(predefinedAmount.toString())}
                >
                  {selectedCurrency === 'MXN' ? `$${predefinedAmount}` : `${predefinedAmount} AXO`}
                </Button>
              ))}
            </div>
          </div>

          {/* Monto personalizado */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto Personalizado</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step={selectedCurrency === 'MXN' ? '0.01' : '1'}
              placeholder={selectedCurrency === 'MXN' ? 'Ej: 150.00' : 'Ej: 75'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label>Método de Pago</Label>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card 
                    key={method.value}
                    className={`cursor-pointer transition-colors ${
                      paymentMethod === method.value 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod(method.value)}
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{method.label}</span>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 ${
                        paymentMethod === method.value 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Descripción opcional */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Ej: Recarga para viaje a Cancún"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Resumen */}
          {amount && paymentMethod && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <div className="text-sm">
                  <div className="font-medium text-green-800">Resumen de Recarga</div>
                  <div className="text-green-700">
                    Monto: <span className="font-bold">
                      {selectedCurrency === 'MXN' ? `$${amount} MXN` : `${amount} AXO`}
                    </span>
                  </div>
                  <div className="text-green-700">
                    Método: <span className="font-medium">
                      {paymentMethods.find(m => m.value === paymentMethod)?.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddFunds}
            disabled={!amount || !paymentMethod || isLoading}
          >
            {isLoading ? 'Procesando...' : 'Agregar Fondos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundsModal;
