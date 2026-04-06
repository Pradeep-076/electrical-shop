import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api';

const CustomerLogin = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') === 'admin' ? 'admin' : 'customer');
    const [form, setForm] = useState({ email: '', password: '' });
    const [adminForm, setAdminForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const productId = searchParams.get('product');

    const handleCustomerSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/customers/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password })
            });
            const data = await res.json();

            if (res.ok) {
                // Store customer info and their cart in localStorage
                localStorage.setItem('customer', JSON.stringify(data.customer));
                if (data.customer.cart && data.customer.cart.length > 0) {
                    localStorage.setItem('cart', JSON.stringify(data.customer.cart));
                }
                // Redirect to the product they clicked
                if (productId) {
                    navigate(`/products?product=${productId}`);
                } else {
                    navigate('/products');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // Check admin credentials - you can update these with your actual admin credentials
        if (adminForm.email === 'srivelaelectricals@gmail.com' && adminForm.password === 'srivelashop') {
            // Store admin authentication in localStorage
            localStorage.setItem('adminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Invalid admin email or password');
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-white flex items-center justify-center px-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
                    <p className="text-gray-500 text-sm">Sign in to your account</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => {
                            setActiveTab('customer');
                            setError('');
                            setAdminForm({ email: '', password: '' });
                        }}
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'customer'
                                ? 'text-electric border-electric'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('admin');
                            setError('');
                            setForm({ email: '', password: '' });
                        }}
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'admin'
                                ? 'text-electric border-electric'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        Admin
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {/* Customer Login Form */}
                {activeTab === 'customer' && (
                    <form onSubmit={handleCustomerSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-electric/30 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                )}

                {/* Admin Login Form */}
                {activeTab === 'admin' && (
                    <form onSubmit={handleAdminSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                            <input
                                type="email"
                                required
                                value={adminForm.email}
                                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                placeholder="srivelaelectricals@gmail.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                            <input
                                type="password"
                                required
                                value={adminForm.password}
                                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                                placeholder="Enter admin password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-electric/30"
                        >
                            Admin Login
                        </button>
                    </form>
                )}

                {/* Customer Registration Link */}
                {activeTab === 'customer' && (
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don't have an account? <Link to={`/customer-register${productId ? `?product=${productId}` : ''}`} className="text-electric font-medium hover:underline">Register here</Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default CustomerLogin;
