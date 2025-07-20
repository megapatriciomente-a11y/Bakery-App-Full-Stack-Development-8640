import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const { FiMapPin, FiCreditCard, FiDollarSign, FiCheck, FiArrowLeft } = FiIcons;

function Checkout() {
  const { cartItems, getTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address ? `${user.address}, ${user.city}` : ''
  );
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const paymentMethods = [
    { id: 'credit_card', name: 'Cartão de Crédito', icon: FiCreditCard },
    { id: 'debit_card', name: 'Cartão de Débito', icon: FiCreditCard },
    { id: 'pix', name: 'PIX', icon: FiDollarSign },
    { id: 'cash', name: 'Dinheiro na Entrega', icon: FiDollarSign }
  ];

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert('Por favor, informe o endereço de entrega');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: getTotal(),
          deliveryAddress,
          paymentMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        alert(data.message || 'Erro ao processar pedido');
      }
    } catch (error) {
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Carrinho vazio
          </h2>
          <p className="text-gray-600 mb-8">
            Adicione alguns produtos ao carrinho antes de finalizar
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Ver Menu</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <SafeIcon icon={FiCheck} className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Pedido Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu pedido foi recebido e está sendo preparado. Você receberá atualizações em breve.
          </p>
          <div className="text-sm text-gray-500">
            Redirecionando para seus pedidos em 3 segundos...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Voltar ao Carrinho</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Finalizar Pedido
          </h1>
          <p className="text-gray-600">
            Revise suas informações antes de confirmar
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <SafeIcon icon={FiMapPin} className="w-5 h-5 mr-2 text-purple-600" />
                Endereço de Entrega
              </h3>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Digite o endereço completo para entrega"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                rows={3}
                required
              />
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <SafeIcon icon={FiCreditCard} className="w-5 h-5 mr-2 text-purple-600" />
                Forma de Pagamento
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <motion.label
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <SafeIcon icon={method.icon} className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-medium text-gray-800">{method.name}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 h-fit"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Resumo do Pedido
            </h3>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{item.image}</div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-purple-600">R$ {getTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Processando...' : 'Confirmar Pedido'}
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao confirmar, você concorda com nossos termos de serviço
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;