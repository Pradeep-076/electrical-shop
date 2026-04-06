import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, ShoppingCart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import API from '../api';

const categories = ['All', 'LED Lights', 'Fans', 'Appliances', 'Wires', 'Pipes', 'Accessories'];

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const productId = searchParams.get('product');
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });

    // Initial Mock Data
    const mockProducts = [
        { id: 1, name: 'LED Tubelight 20W', category: 'LED Lights', price: 150, description: 'High brightness 20W LED tubelight with energy saving technology. Long life span and flicker-free illumination.', imageUrl: '/images/led-tubelight-20w.png' },
        { id: 2, name: 'LED Bulb 9W', category: 'LED Lights', price: 70, description: 'Energy efficient 9W cool white LED bulb with 1 year warranty. Saves up to 80% energy compared to traditional bulbs.', imageUrl: 'https://images.pexels.com/photos/45072/pexels-photo-45072.jpeg?auto=compress&cs=tinysrgb&w=500' },
        { id: 3, name: 'Ceiling Fan', category: 'Fans', price: 1950, description: 'High speed ceiling fan with aerodynamic blades and silent motor. Available in multiple colors.', imageUrl: '/images/ceiling-fan-white.png' },
        { id: 4, name: 'Water Heater 10L', category: 'Appliances', price: 6500, description: 'Instant water heater 10 litre with advanced safety features. Energy efficient with auto cut-off protection.', imageUrl: '/images/water-heater.png' },
        { id: 5, name: '1.0 Sq mm Wire', category: 'Wires', price: 1480, description: 'Premium quality 1.0 sq mm flame retardant copper wires. High conductivity and durable insulation.', imageUrl: '/images/wires-cables.png' },
        { id: 6, name: 'Tape Roll', category: 'Accessories', price: 10, description: 'High quality electrical insulation tape roll. Flame resistant, strong adhesive, and long-lasting.', imageUrl: '/images/tap-roll.png' },
        { id: 7, name: '1 Inch 15kg PVC Pipe', category: 'Pipes', price: 350, description: 'ISI marked 1 inch 15kg PVC conduit pipes for electrical wiring. Durable, anti-corrosive, and easy to install.', imageUrl: '/images/pvc-pipes.png' },
        { id: 8, name: '1 Inch CPVC Pipe', category: 'Pipes', price: 420, description: 'High grade 1 inch CPVC pipes for hot and cold water applications. Heat resistant and long lasting.', imageUrl: '/images/cpvc-pipes.png' },
        { id: 9, name: '4W MCB Box', category: 'Accessories', price: 200, description: 'Galvanized metal 4 way MCB distribution box for switch and socket mounting. Rust proof and sturdy construction.', imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=500' },
        { id: 10, name: '1 Inch Star Screw', category: 'Accessories', price: 1, description: 'High quality 1 inch star head screws. Corrosion resistant, durable, and suitable for electrical fittings.', imageUrl: '/images/screws.png' },
    ];

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, searchQuery]);

    const filterMockProducts = (list) => {
        let filtered = [...list];
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
            if (searchQuery) queryParams.append('search', searchQuery);

            const response = await fetch(`${API}/api/products?${queryParams.toString()}`);
            const result = await response.json();

            let productList = [];
            if (result.data && result.data.length > 0) {
                productList = result.data;
            } else {
                // API returned empty — use filtered mock products as fallback
                productList = filterMockProducts(mockProducts);
            }

            // If a specific product was requested (from login redirect), filter to it
            if (productId) {
                const filtered = productList.filter(p => String(p.id) === productId);
                setProducts(filtered.length > 0 ? filtered : productList);
            } else {
                setProducts(productList);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // Server offline — use filtered mock products
            setProducts(filterMockProducts(mockProducts));
        } finally {
            setLoading(false);
        }
    };

    // Cart functions
    const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
    const [cartCount, setCartCount] = useState(getCart().reduce((sum, item) => sum + item.quantity, 0));

    const handleAddToCart = (product) => {
        // Check if user is logged in
        const customerStr = localStorage.getItem('customer');
        if (!customerStr) {
            // Not logged in - redirect to login
            navigate('/customer-login');
            return;
        }
        
        // User is logged in - add to cart
        const cart = getCart();
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

        // Sync with server if logged in
        if (customerStr) {
            const customer = JSON.parse(customerStr);
            fetch(`${API}/api/customers/${customer.id}/cart`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart })
            }).catch(err => console.error('Cart sync failed:', err));
        }
    };

    const handleInquire = (product) => {
        // Check if user is logged in
        const customerStr = localStorage.getItem('customer');
        if (!customerStr) {
            // Not logged in - redirect to login
            navigate('/customer-login');
            return;
        }
        // User is logged in - show inquiry modal
        setSelectedProduct(product);
        setShowInquiryModal(true);
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...inquiryForm,
                    productId: selectedProduct.id,
                    email: '' // Optional default
                })
            });
            if (res.ok) {
                alert('Inquiry Sent Successfully!');
                setShowInquiryModal(false);
                setInquiryForm({ name: '', phone: '', message: '' });
            } else {
                alert('Failed to send inquiry.');
            }
        } catch (err) {
            console.error(err);
            alert('Error sending inquiry.');
        }
    };

    return (
        <>
        <div className="pt-24 min-h-screen bg-gold-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header & Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
                        <p className="text-gray-500 mt-2">Browse our premium collection of electrical essentials.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent w-full sm:w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-8 pb-4 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                ? 'bg-electric text-white shadow-lg shadow-electric/30'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {products.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} onInquire={handleInquire} onAddToCart={handleAddToCart} />
                        ))}
                    </motion.div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">No products found</div>
                        <button
                            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                            className="text-electric font-medium hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Inquiry Modal */}
            {showInquiryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl"
                    >
                        <button
                            onClick={() => setShowInquiryModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Order Product</h2>
                        <p className="text-gray-500 mb-6">Order <span className="font-semibold text-gray-900">{selectedProduct?.name}</span>?</p>

                        <form onSubmit={handleInquirySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text" required
                                    value={inquiryForm.name}
                                    onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric focus:outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel" required
                                    value={inquiryForm.phone}
                                    onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric focus:outline-none"
                                    placeholder="+91 90038 21871"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                <textarea
                                    value={inquiryForm.message}
                                    onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric focus:outline-none"
                                    rows="3"
                                    placeholder="I need 50 pieces of this item..."
                                ></textarea>
                            </div>
                            <button className="w-full py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-electric/30">
                                Place Order
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <Link to="/cart">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="fixed bottom-8 right-8 bg-electric text-white p-4 rounded-full shadow-2xl shadow-electric/40 hover:bg-blue-600 transition-colors cursor-pointer z-50"
                    >
                        <ShoppingCart size={24} />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    </motion.div>
                </Link>
            )}
        </>
    );
};

export default Products;
