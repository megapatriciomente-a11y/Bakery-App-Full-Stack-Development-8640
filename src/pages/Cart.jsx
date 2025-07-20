import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } = FiIcons;

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log('Cart - Current cart items:', cartItems); // Debug log

  const handleQuantityChange = (id, newQuantity) => {
    console.log('Cart - Changing quantity:', id, newQuantity); // Debug log
    if (newQuantity === 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Faça login para finalizar sua compra');
      navigate('/login');
      return;
    }
    navigate('/checkout');
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
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-8">
            Que tal adicionar alguns de nossos deliciosos bolos?
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

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              <span>Continuar Comprando</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Seu Carrinho
          </h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no seu carrinho
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{item.image}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-purple-600 font-medium">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <SafeIcon icon={FiMinus} className="w-4 h-4 text-gray-600" />
                      </motion.button>
                      
                      <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-green-50 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="w-4 h-4 text-gray-600" />
                      </motion.button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-xl font-bold text-gray-800 min-w-[6rem] text-right">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 h-fit"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Resumo do Pedido
            </h3>

            {/* Summary Items */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-600">R$ {getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <SafeIcon icon={FiShoppingBag} className="w-5 h-5" />
                <span>Finalizar Pedido</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCart}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600 transition-all duration-300"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                <span>Limpar Carrinho</span>
              </motion.button>
            </div>

            {!isAuthenticated && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  ⚠️ É necessário fazer login para finalizar a compra
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Cart;