import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-electric/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neonYellow/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                {/* Text Content */}
                <div className="w-full md:w-1/2 text-center md:text-left pt-20 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                            Quality <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-blue-400">Electrical</span> <br />
                            Solutions
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0">
                            Your one-stop shop for premium pipes, LED lights, switches, and wiring materials.
                            Lighting up homes and industries since 2020.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <Link to="/products">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-electric text-white rounded-full font-bold shadow-lg shadow-electric/50 flex items-center gap-2 group"
                                >
                                    Explore Products
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link to="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold backdrop-blur-sm hover:bg-white/10 transition-colors"
                                >
                                    Contact Us
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Visual/Image Placeholder */}
                <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center perspective-1000">
                    <motion.div
                        initial={{ opacity: 0, rotateY: -20, x: 50 }}
                        animate={{ opacity: 1, rotateY: 0, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative w-full max-w-lg aspect-square"
                    >
                        {/* Abstract Decorative Circles representing lights/products */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-electric/20 to-transparent rounded-3xl backdrop-blur-3xl border border-white/10 p-8 shadow-2xl">
                            <div className="w-full h-full bg-grid-white/[0.05] rounded-xl flex items-center justify-center relative overflow-hidden">
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="absolute w-32 h-32 bg-neonYellow/80 rounded-full blur-xl top-1/4 left-1/4"
                                />
                                <motion.div
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                    className="absolute w-40 h-40 bg-electric/80 rounded-full blur-xl bottom-1/4 right-1/4"
                                />
                                <img
                                    src="/images/IMG_3477.JPG.jpeg"
                                    alt="Sri Vela"
                                    className="w-48 h-48 object-contain"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
