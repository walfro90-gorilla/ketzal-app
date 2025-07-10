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
import { useToast } from '@/components/use-toast';
import { ArrowUpDown, User, AlertTriangle } from 'lucide-react';

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransferFundsModal: React.FC<TransferFundsModalProps> = ({ isOpen, onClose }) => {
  const { transferFundsFromWallet, wallet, isLoading, hasInsufficientFunds, formatCurrency } = useWallet();
  const { showToast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<'MXN' | 'AXO'>('MXN');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleTransfer = async () => {
    if (!recipientEmail || !amount) {
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

    // Validar email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      showToast({
        title: 'Error',
        description: 'Por favor ingresa un email válido'
      });
      return;
    }

    // Verificar fondos suficientes
    const amountMXN = selectedCurrency === 'MXN' ? numericAmount : 0;
    const amountAxo = selectedCurrency === 'AXO' ? numericAmount : 0;
    
    if (hasInsufficientFunds(amountMXN, amountAxo)) {
      showToast({
        title: 'Fondos Insuficientes',
        description: `No tienes suficientes ${selectedCurrency === 'MXN' ? 'pesos mexicanos' : 'Axo Coins'} para esta transferencia`
      });
      return;
    }

    try {
      const transferData = {
        recipientEmail,
        [selectedCurrency === 'MXN' ? 'amountMXN' : 'amountAxo']: numericAmount,
        description: description || `Transferencia de ${selectedCurrency}`
      };

      const success = await transferFundsFromWallet(transferData);
      
      if (success) {
        showToast({
          title: 'Transferencia Exitosa',
          description: `Se transfirieron ${formatCurrency(numericAmount, selectedCurrency)} a ${recipientEmail}`
        });
        resetForm();
        onClose();
      } else {
        showToast({
          title: 'Error',
          description: 'Error al realizar la transferencia. Verifica el email del destinatario.'
        });
      }
    } catch (error) {
      console.error('Error al transferir fondos:', error);
      showToast({
        title: 'Error',
        description: 'Error al procesar la transferencia'
      });
    }
  };

  const resetForm = () => {
    setRecipientEmail('');
    setAmount('');
    setDescription('');
    setSelectedCurrency('MXN');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getCurrentBalance = () => {
    if (!wallet) return 0;
    return selectedCurrency === 'MXN' ? wallet.balanceMXN : wallet.balanceAxo;
  };

  const getMaxTransferAmount = () => {
    const balance = getCurrentBalance();
    return Math.max(0, balance - 0.01); // Mantener un pequeño saldo mínimo
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Transferir Fondos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Balance disponible */}
          {wallet && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <div className="text-sm font-medium text-blue-800 mb-1">Saldo Disponible</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-blue-700">
                    <span className="font-medium">MXN:</span> {formatCurrency(wallet.balanceMXN, 'MXN')}
                  </div>
                  <div className="text-blue-700">
                    <span className="font-medium">AXO:</span> {formatCurrency(wallet.balanceAxo, 'AXO')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email del destinatario */}
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Email del Destinatario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="recipientEmail"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

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

          {/* Monto a transferir */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto a Transferir</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              max={getMaxTransferAmount()}
              step={selectedCurrency === 'MXN' ? '0.01' : '1'}
              placeholder={selectedCurrency === 'MXN' ? 'Ej: 100.00' : 'Ej: 50'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="text-xs text-gray-500">
              Máximo disponible: {formatCurrency(getMaxTransferAmount(), selectedCurrency)}
            </div>
            {/* Botón para monto máximo */}
            {getMaxTransferAmount() > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(getMaxTransferAmount().toString())}
                className="text-xs"
              >
                Transferir Todo
              </Button>
            )}
          </div>

          {/* Verificación de fondos */}
          {amount && parseFloat(amount) > 0 && (
            hasInsufficientFunds(
              selectedCurrency === 'MXN' ? parseFloat(amount) : 0,
              selectedCurrency === 'AXO' ? parseFloat(amount) : 0
            ) ? (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="text-sm text-red-700">
                    Fondos insuficientes para esta transferencia
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-3">
                  <div className="text-sm text-green-700">
                    ✓ Fondos suficientes disponibles
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {/* Descripción opcional */}
          <div className="space-y-2">
            <Label htmlFor="description">Concepto (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Ej: Pago por servicios turísticos"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Resumen de transferencia */}
          {amount && recipientEmail && parseFloat(amount) > 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-800 mb-1">Resumen de Transferencia</div>
                  <div className="text-gray-700">
                    <div>Destinatario: <span className="font-medium">{recipientEmail}</span></div>
                    <div>Monto: <span className="font-bold text-blue-600">
                      {formatCurrency(parseFloat(amount), selectedCurrency)}
                    </span></div>
                    {description && (
                      <div>Concepto: <span className="font-medium">{description}</span></div>
                    )}
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
            onClick={handleTransfer}
            disabled={
              !recipientEmail || 
              !amount || 
              parseFloat(amount) <= 0 ||
              hasInsufficientFunds(
                selectedCurrency === 'MXN' ? parseFloat(amount || '0') : 0,
                selectedCurrency === 'AXO' ? parseFloat(amount || '0') : 0
              ) ||
              isLoading
            }
          >
            {isLoading ? 'Transfiriendo...' : 'Transferir Fondos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferFundsModal;
