import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Zap, Star, Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';


const features = [
    { icon: ShieldCheck, title: 'Premium Quality', desc: 'Certified products from top brands matching international standards.' },
    { icon: Zap, title: 'Energy Efficient', desc: 'Latest LED technology and power-saving electrical solutions.' },
    { icon: Clock, title: '24/7 Support', desc: 'Expert technical support and guidance for your projects.' },
];

const stats = [
    { value: '6+', label: 'Years of Experience' },
    { value: '5000+', label: 'Happy Customers' },
    { value: '1000+', label: 'Products Available' },
    { value: '50+', label: 'Brands Partnered' },
];

const testimonials = [
    { name: 'R. Kumar', role: 'Contractor', text: 'Sri Vela Electricals is my go-to shop for all construction projects. Excellent quality and pricing.', rating: 5 },
    { name: 'S. Priya', role: 'Homeowner', text: 'Beautiful collection of fancy lights. The staff helped me choose the perfect lighting for my new home.', rating: 5 },
    { name: 'M. David', role: 'Electrician', text: 'They always have the latest wiring materials and switches in stock. Very reliable service.', rating: 4 },
];

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/products`);
            const result = await response.json();
            if (result.data && result.data.length > 0) {
                setFeaturedProducts(result.data.slice(0, 4));
            } else {
                setFeaturedProducts(mockProducts.slice(0, 4));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setFeaturedProducts(mockProducts.slice(0, 4));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/products');
        }
    };



    return (
        <div className="overflow-x-hidden">

            {/* Search & Hero Section */}
            <section className="pt-28 pb-16 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-electric/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-neonYellow/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                    >
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-blue-400">Electrical</span> Needs
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto"
                    >
                        Search from our wide range of premium electrical products — LED lights, fans, pipes, switches and more.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.form
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-full overflow-hidden shadow-2xl shadow-electric/10"
                    >
                        <div className="flex items-center flex-1 px-6">
                            <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-4 bg-transparent text-white placeholder-gray-400 outline-none text-base"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-4 bg-electric text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            Search
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.form>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                            >
                                Featured <span className="text-electric">Products</span>
                            </motion.h2>
                            <p className="text-gray-500">Explore our best-selling electrical products</p>
                        </div>
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-electric transition-colors"
                            >
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-gray-50 rounded-2xl aspect-square animate-pulse border border-gray-100"></div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {featuredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => navigate(`/customer-login?product=${product.id}`)}
                                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                                        <span className="text-xs text-electric font-medium">{product.category}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Mobile View All Button */}
                    <div className="flex sm:hidden justify-center mt-8">
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-electric transition-colors"
                            >
                                View All Products
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gold-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                        >
                            Why Choose <span className="text-electric">Us?</span>
                        </motion.h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We deliver excellence in every product. Putting power in your hands with reliability and trust.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-electric/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-electric transition-colors duration-300">
                                    <feature.icon className="w-7 h-7 text-electric group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-electric relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.5, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-blue-100 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative"
                            >
                                <div className="absolute -top-4 left-8 text-6xl text-electric/20 font-serif">"</div>
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-neonYellow fill-neonYellow' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic">{item.text}</p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                        {item.name[0]}
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                                        <span className="text-xs text-electric uppercase tracking-wider">{item.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900"></div>
                <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-electric to-purple-600"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Light Up Your Space?</h2>
                    <p className="text-gray-300 text-lg mb-8">Browse our extensive catalog or visit our store for personalized consultation.</p>
                    <Link to="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-neonYellow text-gray-900 font-bold rounded-full shadow-lg hover:bg-yellow-400 transition-colors"
                        >
                            Contact Us Today
                        </motion.button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
