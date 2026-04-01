import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Zap, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const XIcon = () => (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );

    return (
        <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">
            {/* Wave Animation */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                <svg
                    className="relative block w-[calc(100%+1.3px)] h-[50px]"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="fill-[#FFF8F0]"
                    ></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="h-10 w-10 flex items-center justify-center p-1 bg-white/10 rounded-lg overflow-hidden">
                                <img
                                    src="/images/IMG_3477.JPG.jpeg"
                                    alt="Sri Vela Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold tracking-wider">
                                SRI <span className="text-electric">VELA</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premium electrical solutions for modern homes and industries.
                            Quality products, expert service, and a commitment to excellence since 2020.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {[Facebook, Instagram, XIcon].map((Icon, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ y: -5, color: '#007BFF' }}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-colors"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-electric">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'Products', 'About Us', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-electric mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-electric">Categories</h3>
                        <ul className="space-y-3">
                            {['LED Lights', 'Wires & Cables', 'Switches', 'Pipes & Fittings'].map((item) => (
                                <li key={item}>
                                    <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-electric">Get In Touch</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-electric mt-1 flex-shrink-0" />
                                <span>Main Road, Near Kongu Bakery, Tiruchengode Road, Nallipalayam, Namakkal-637003</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-5 h-5 text-electric flex-shrink-0" />
                                <span>+91 90038 21871</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Mail className="w-5 h-5 text-electric flex-shrink-0" />
                                <span>Gokulnathkannan2000@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Sri Vela Electricals. All rights reserved.
                    </p>
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ y: -5 }}
                        className="mt-4 md:mt-0 p-3 bg-electric/10 rounded-full text-electric hover:bg-electric hover:text-white transition-all"
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
