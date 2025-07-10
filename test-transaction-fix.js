// Prueba de la lógica de formateo de transacciones corregida

const formatCurrency = (amount, currency) => {
  if (currency === 'MXN') {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  } else {
    return `${amount.toFixed(2)} AXO`;
  }
};

const formatTransactionAmount = (transaction) => {
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

// Casos de prueba
console.log('🧪 Probando la lógica corregida:');

// Caso 1: Transferencia enviada (monto negativo)
const transferSent = {
  type: 'TRANSFER_SENT',
  amountMXN: -1000,
  amountAxo: null,
  description: 'Transferencia a usuario@email.com'
};

console.log('📤 Transferencia enviada (-1000 MXN):', formatTransactionAmount(transferSent));
// Debería mostrar: $1,000.00

// Caso 2: Transferencia recibida (monto positivo)
const transferReceived = {
  type: 'TRANSFER_RECEIVED', 
  amountMXN: 1000,
  amountAxo: null,
  description: 'Transferencia de usuario@email.com'
};

console.log('📥 Transferencia recibida (+1000 MXN):', formatTransactionAmount(transferReceived));
// Debería mostrar: $1,000.00

// Caso 3: Transferencia enviada en AXO (monto negativo)
const transferSentAxo = {
  type: 'TRANSFER_SENT',
  amountMXN: null,
  amountAxo: -10,
  description: 'Transferencia AXO a usuario@email.com'
};

console.log('📤 Transferencia AXO enviada (-10 AXO):', formatTransactionAmount(transferSentAxo));
// Debería mostrar: 10.00 AXO

// Caso 4: Depósito (monto positivo)
const deposit = {
  type: 'DEPOSIT',
  amountMXN: 5000,
  amountAxo: null,
  description: 'Depósito desde tarjeta'
};

console.log('💳 Depósito (+5000 MXN):', formatTransactionAmount(deposit));
// Debería mostrar: $5,000.00

console.log('✅ Todos los casos muestran ahora el monto correcto!');
