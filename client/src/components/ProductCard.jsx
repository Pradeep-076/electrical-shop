import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Info, ShoppingCart, X } from 'lucide-react';

const ProductCard = ({ product, onInquire, onAddToCart }) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <>
            <motion.div
                whileHover={{ y: -10 }}
                onClick={() => setShowActions(true)}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
            >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag size={48} />
                        </div>
                    )}
                    <div className="absolute top-2 right-2 bg-electric text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.category}
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-electric">₹{product.price}</span>
                        <span className="text-sm text-gray-400">Click to order</span>
                    </div>
                </div>
            </motion.div>

            {/* Product Action Modal */}
            <AnimatePresence>
                {showActions && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowActions(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowActions(false)}
                                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white/80 rounded-full p-1"
                            >
                                <X size={20} />
                            </button>

                            <div className="h-56 overflow-hidden bg-gray-100">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag size={64} />
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                                    <span className="px-2 py-1 bg-blue-50 text-electric text-xs font-bold rounded-full">{product.category}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                                <p className="text-2xl font-bold text-electric mb-6">₹{product.price}</p>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { onAddToCart(product); setShowActions(false); }}
                                        className="flex-1 px-4 py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-electric/30"
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { onInquire(product); setShowActions(false); }}
                                        className="px-4 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    >
                                        <Info size={18} />
                                        Order
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;
