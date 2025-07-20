import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const { FiHome, FiMenu, FiShoppingCart, FiUser, FiLogOut, FiSettings, FiPackage, FiX } = FiIcons;

function Navbar() {
  const location = useLocation();
  const { cartItems, getItemCount } = useCart();
  const { isAuthenticated, user, userType, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartItemCount = getItemCount();

  const customerNavItems = [
    { path: '/', icon: FiHome, label: 'Início' },
    { path: '/menu', icon: FiMenu, label: 'Menu' },
    { path: '/cart', icon: FiShoppingCart, label: 'Carrinho', badge: cartItemCount },
  ];

  const customerUserItems = [
    { path: '/orders', icon: FiPackage, label: 'Pedidos' },
    { path: '/profile', icon: FiUser, label: 'Perfil' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-800 to-pink-600 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-white"
              >
                🍰 Delícias da Ney
              </motion.div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {customerNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-yellow-300 bg-purple-900'
                      : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {userType === 'customer' && (
                    <>
                      {customerUserItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === item.path
                              ? 'text-yellow-300 bg-purple-900'
                              : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                          }`}
                        >
                          <SafeIcon icon={item.icon} className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </>
                  )}

                  {userType === 'admin' && (
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/admin'
                          ? 'text-yellow-300 bg-purple-900'
                          : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                      }`}
                    >
                      <SafeIcon icon={FiSettings} className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="flex items-center space-x-2 text-white">
                    <span className="text-sm">
                      Olá, {user?.name?.split(' ')[0] || user?.username}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-yellow-300 hover:bg-purple-700 transition-colors"
                  >
                    <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                    <span>Sair</span>
                  </motion.button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/login'
                        ? 'text-yellow-300 bg-purple-900'
                        : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                    }`}
                  >
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    to="/register"
                    className="bg-yellow-400 text-purple-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-300 transition-colors"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-yellow-300 p-2"
              >
                <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-purple-800 to-pink-600 shadow-lg md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Items */}
              {customerNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-yellow-300 bg-purple-900'
                      : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* User Items */}
              {isAuthenticated ? (
                <>
                  {userType === 'customer' && (
                    <>
                      {customerUserItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === item.path
                              ? 'text-yellow-300 bg-purple-900'
                              : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                          }`}
                        >
                          <SafeIcon icon={item.icon} className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </>
                  )}

                  {userType === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/admin'
                          ? 'text-yellow-300 bg-purple-900'
                          : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                      }`}
                    >
                      <SafeIcon icon={FiSettings} className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="px-3 py-2 text-white text-sm border-t border-purple-700">
                    Olá, {user?.name?.split(' ')[0] || user?.username}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-yellow-300 hover:bg-purple-700 transition-colors"
                  >
                    <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 border-t border-purple-700 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/login'
                        ? 'text-yellow-300 bg-purple-900'
                        : 'text-white hover:text-yellow-300 hover:bg-purple-700'
                    }`}
                  >
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block bg-yellow-400 text-purple-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-300 transition-colors text-center"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;