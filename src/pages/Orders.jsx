import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiPackage, FiClock, FiCheck, FiTruck, FiX } = FiIcons;

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/customers/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        label: 'Pendente', 
        color: 'text-yellow-600 bg-yellow-50', 
        icon: FiClock 
      },
      confirmed: { 
        label: 'Confirmado', 
        color: 'text-blue-600 bg-blue-50', 
        icon: FiCheck 
      },
      preparing: { 
        label: 'Preparando', 
        color: 'text-orange-600 bg-orange-50', 
        icon: FiPackage 
      },
      ready: { 
        label: 'Pronto', 
        color: 'text-green-600 bg-green-50', 
        icon: FiCheck 
      },
      delivered: { 
        label: 'Entregue', 
        color: 'text-green-600 bg-green-50', 
        icon: FiTruck 
      },
      cancelled: { 
        label: 'Cancelado', 
        color: 'text-red-600 bg-red-50', 
        icon: FiX 
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Nenhum pedido encontrado
          </h2>
          <p className="text-gray-600 mb-8">
            Você ainda não fez nenhum pedido. Que tal experimentar nossos deliciosos bolos?
          </p>
          <a
            href="#/menu"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <span>Ver Menu</span>
          </a>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    <SafeIcon icon={statusInfo.icon} className="w-4 h-4" />
                    <span>{statusInfo.label}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Itens:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{item.image}</div>
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Endereço de Entrega:</h4>
                    <p className="text-gray-600 text-sm">{order.delivery_address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Forma de Pagamento:</h4>
                    <p className="text-gray-600 text-sm">
                      {order.payment_method === 'credit_card' && 'Cartão de Crédito'}
                      {order.payment_method === 'debit_card' && 'Cartão de Débito'}
                      {order.payment_method === 'pix' && 'PIX'}
                      {order.payment_method === 'cash' && 'Dinheiro na Entrega'}
                    </p>
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-purple-600">
                    R$ {parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Orders;