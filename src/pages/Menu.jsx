import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const { FiPlus, FiCheck, FiHeart, FiStar, FiShoppingCart } = FiIcons;

function Menu() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState({});

  const menuItems = [
    {
      id: 1,
      name: 'Bolo Coração',
      price: 150,
      description: 'Bolo em formato de coração, perfeito para demonstrar amor e carinho',
      image: '❤️',
      category: 'Especiais',
      rating: 4.9,
      features: ['Formato único', 'Sabor personalizado', 'Decoração especial']
    },
    {
      id: 2,
      name: 'Bolo Retangular 27x18cm',
      price: 170,
      description: 'Bolo retangular ideal para festas e comemorações em família',
      image: '🎂',
      category: 'Tradicionais',
      rating: 4.8,
      features: ['Tamanho ideal', 'Serve até 15 pessoas', 'Sabores variados']
    },
    {
      id: 3,
      name: 'Bolo Quadrado 20x20cm',
      price: 200,
      description: 'Bolo quadrado elegante, perfeito para ocasiões sofisticadas',
      image: '🍰',
      category: 'Premium',
      rating: 5.0,
      features: ['Design elegante', 'Ingredientes premium', 'Acabamento perfeito']
    },
    {
      id: 4,
      name: 'Bolo de Chocolate',
      price: 120,
      description: 'Delicioso bolo de chocolate com cobertura cremosa',
      image: '🍫',
      category: 'Tradicionais',
      rating: 4.7,
      features: ['Chocolate belga', 'Massa fofinha', 'Cobertura cremosa']
    },
    {
      id: 5,
      name: 'Bolo de Morango',
      price: 140,
      description: 'Bolo saboroso com morangos frescos e chantilly',
      image: '🍓',
      category: 'Especiais',
      rating: 4.8,
      features: ['Morangos frescos', 'Chantilly caseiro', 'Massa delicada']
    },
    {
      id: 6,
      name: 'Bolo de Aniversário',
      price: 180,
      description: 'Bolo especial para aniversários com decoração personalizada',
      image: '🎉',
      category: 'Premium',
      rating: 5.0,
      features: ['Decoração personalizada', 'Velas incluídas', 'Sabor à escolha']
    }
  ];

  const handleAddToCart = (item) => {
    console.log('Menu - Adding item to cart:', item); // Debug log
    
    // Add to cart
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });

    // Show feedback
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    
    // Reset feedback after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);

    // Show success message
    alert(`${item.name} foi adicionado ao carrinho!`);
  };

  const handleBuyNow = (item) => {
    // Add to cart first
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Faça login para continuar com a compra');
      navigate('/login');
      return;
    }

    // Go directly to checkout
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Nosso Menu Especial
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra nossa seleção de bolos artesanais, cada um preparado com ingredientes especiais e muito amor
          </p>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 h-48 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-6xl"
                >
                  {item.image}
                </motion.div>
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-purple-600">
                  {item.category}
                </div>
                <div className="absolute top-4 left-4 bg-yellow-400 px-2 py-1 rounded-full flex items-center space-x-1 text-sm font-medium">
                  <SafeIcon icon={FiStar} className="w-3 h-3" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>

                {/* Features */}
                <div className="mb-6">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price and Actions */}
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-purple-600">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(item)}
                      disabled={addedItems[item.id]}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        addedItems[item.id]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <SafeIcon icon={addedItems[item.id] ? FiCheck : FiShoppingCart} className="w-4 h-4" />
                      <span className="text-sm">
                        {addedItems[item.id] ? 'Adicionado!' : 'Carrinho'}
                      </span>
                    </motion.button>

                    {/* Buy Now Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBuyNow(item)}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      <span className="text-sm">Comprar</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl"
        >
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Algo Especial em Mente?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Entre em contato conosco para bolos personalizados e sabores únicos
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-600">
            <SafeIcon icon={FiHeart} className="w-5 h-5" />
            <span className="font-medium">Fazemos com amor, especialmente para você</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Menu;