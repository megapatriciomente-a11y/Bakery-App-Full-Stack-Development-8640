import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiRefreshCw, FiEdit } = FiIcons;

function Admin() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [customersRes, ordersRes, statsRes] = await Promise.all([
        fetch('http://localhost:3001/api/admin/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setCustomers(await customersRes.json());
      setOrders(await ordersRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getChartOptions = () => {
    const dailyRevenue = orders.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + parseFloat(order.total_amount);
      return acc;
    }, {});

    return {
      title: {
        text: 'Receita Diária',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: R$ {c}'
      },
      xAxis: {
        type: 'category',
        data: Object.keys(dailyRevenue).slice(-7) // Last 7 days
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: 'R$ {value}'
        }
      },
      series: [{
        data: Object.values(dailyRevenue).slice(-7),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(147, 51, 234, 0.3)' },
              { offset: 1, color: 'rgba(147, 51, 234, 0.05)' }
            ]
          }
        },
        lineStyle: { color: '#9333ea' },
        itemStyle: { color: '#9333ea' }
      }]
    };
  };

  const statCards = [
    {
      title: 'Total de Clientes',
      value: customers.length,
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Pedidos',
      value: stats.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue || '0.00'}`,
      icon: FiDollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${stats.averageOrderValue || '0.00'}`,
      icon: FiTrendingUp,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendente', color: 'text-yellow-600' },
    { value: 'confirmed', label: 'Confirmado', color: 'text-blue-600' },
    { value: 'preparing', label: 'Preparando', color: 'text-orange-600' },
    { value: 'ready', label: 'Pronto', color: 'text-green-600' },
    { value: 'delivered', label: 'Entregue', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelado', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Gerencie clientes, pedidos e acompanhe as estatísticas
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiRefreshCw} className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-xl p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <ReactECharts option={getChartOptions()} height="300px" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Orders Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Pedidos Recentes
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {orders.slice(0, 10).map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Pedido #{order.id} - {order.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className="font-bold text-purple-600">
                      R$ {parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {order.items.length} item(s)
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Customers Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Clientes Recentes
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customers.slice(0, 10).map((customer) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <p className="text-xs text-gray-400">
                      Cadastrado em {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {customer.phone && (
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    )}
                    {customer.city && (
                      <p className="text-xs text-gray-500">{customer.city}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Admin;