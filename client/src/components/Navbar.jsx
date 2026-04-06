import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, ShoppingCart, ClipboardList, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const readLocalStorageJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [customer, setCustomer] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const updateCartCount = () => {
            const cart = readLocalStorageJSON('cart', []);
            setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
        };
        const updateCustomer = () => {
            const c = readLocalStorageJSON('customer', null);
            setCustomer(c);
        };
        updateCartCount();
        updateCustomer();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('storage', updateCustomer);
        const interval = setInterval(() => { updateCartCount(); updateCustomer(); }, 1000);
        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('storage', updateCustomer);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('customer');
        localStorage.removeItem('cart');
        setCustomer(null);
        setCartCount(0);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/10 backdrop-blur-lg shadow-lg border-b border-white/20' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="h-12 w-12 flex items-center justify-center p-1 bg-white/10 rounded-lg overflow-hidden group-hover:bg-white/20 transition-colors">
                            <img
                                src="/images/IMG_3477.JPG.jpeg"
                                alt="Sri Vela Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <span className={`text-2xl font-bold tracking-wider ${location.pathname === '/' ? (scrolled ? 'text-gray-900' : 'text-white') : 'text-gray-900'}`}>
                            SRI <span className="text-electric">VELA</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-electric ${location.pathname === link.path
                                        ? 'text-electric'
                                    : (scrolled || location.pathname !== '/') ? 'text-gray-700' : 'text-gray-200'
                                    }`}

                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-electric"
                                        />
                                    )}
                                </Link>
                            ))}

                            {/* Order History - show for logged-in customers */}
                            {customer && (
                                <Link
                                    to="/orders"
                                    className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-electric ${
                                        location.pathname === '/orders'
                                            ? 'text-electric'
                                            : (scrolled || location.pathname !== '/') ? 'text-gray-700' : 'text-gray-200'
                                    }`}
                                >
                                    <ClipboardList size={16} />
                                    My Orders
                                    {location.pathname === '/orders' && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-electric"
                                        />
                                    )}
                                </Link>
                            )}

                            {/* Cart */}
                            <Link to="/cart" className={`relative flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors ${(scrolled || location.pathname !== '/') ? 'text-gray-700' : 'text-gray-200'}`}>
                                <ShoppingCart size={20} style={{transform: 'scaleY(1)'}} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Customer Profile / Login */}
                            {customer ? (
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${(scrolled || location.pathname !== '/') ? 'text-gray-600' : 'text-gray-300'}`}>
                                        {customer.name.split(' ')[0]}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className={`p-1.5 rounded-full hover:bg-red-50 transition-colors ${(scrolled || location.pathname !== '/') ? 'text-gray-400 hover:text-red-500' : 'text-gray-300 hover:text-red-400'}`}
                                        title="Logout"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/customer-login" className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${(scrolled || location.pathname !== '/') ? 'text-gray-600 hover:text-electric' : 'text-gray-300 hover:text-white'}`}>
                                    <User size={16} />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link to="/cart" className={`relative flex items-center justify-center p-2 ${(scrolled || location.pathname !== '/') ? 'text-gray-700' : 'text-white'}`}>
                            <ShoppingCart size={20} style={{transform: 'scaleY(1)'}} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-md ${(scrolled || location.pathname !== '/') ? 'text-gray-900' : 'text-white'} hover:text-electric focus:outline-none`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path
                                        ? 'text-electric bg-blue-50'
                                        : 'text-gray-700 hover:text-electric hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {customer && (
                                <Link
                                    to="/orders"
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/orders'
                                        ? 'text-electric bg-blue-50'
                                        : 'text-gray-700 hover:text-electric hover:bg-gray-50'
                                        }`}
                                >
                                    <ClipboardList size={18} />
                                    My Orders
                                </Link>
                            )}
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-electric bg-blue-50">
                                Admin
                            </Link>
                            {customer ? (
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    Logout ({customer.name.split(' ')[0]})
                                </button>
                            ) : (
                                <Link to="/customer-login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-electric hover:bg-gray-50">
                                    <User size={18} />
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
