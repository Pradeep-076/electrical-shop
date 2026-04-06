import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Package, LogOut, Mail, ShoppingCart, Tag, ToggleLeft, ToggleRight, Send, Loader2, CreditCard, Banknote, Smartphone, IndianRupee } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import API from '../api';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('adminAuthenticated') === 'true');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [products, setProducts] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [orders, setOrders] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const [emailSending, setEmailSending] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '', category: 'Pipes', price: '', description: '', imageUrl: '', stock: ''
    });
    const [newCoupon, setNewCoupon] = useState({
        code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '',
        maxDiscount: '', expiryDate: '', usageLimit: '', description: ''
    });

    const categories = ['Pipes', 'LED Lights', 'Bulbs', 'Switches', 'Wires', 'Appliances', 'Accessories'];



    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchInquiries();
            fetchOrders();
            fetchCoupons();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@srivela.com' && password === 'srivelashop') {
            localStorage.setItem('adminAuthenticated', 'true');
            setIsAuthenticated(true);
        } else {
            alert('Invalid Email or Password');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/products`);
            const data = await res.json();
            if (data.data) setProducts(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInquiries = async () => {
        try {
            const res = await fetch(`${API}/api/inquiries`);
            const data = await res.json();
            if (data.data) setInquiries(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API}/api/orders`);
            const data = await res.json();
            if (data.data) setOrders(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCoupons = async () => {
        try {
            const res = await fetch(`${API}/api/coupons`);
            const data = await res.json();
            if (data.data) setCoupons(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await fetch(`${API}/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendEmail = async (orderId) => {
        setEmailSending(orderId);
        try {
            const res = await fetch(`${API}/api/orders/${orderId}/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchOrders();
            } else {
                alert(data.error || 'Failed to send email');
            }
        } catch (err) {
            alert('Failed to send email');
        } finally {
            setEmailSending(null);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                alert('Product Added!');
                setNewProduct({ name: '', category: 'Pipes', price: '', description: '', imageUrl: '', stock: '' });
                fetchProducts();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`${API}/api/products/${id}`, { method: 'DELETE' });
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/coupons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newCoupon,
                    discountValue: Number(newCoupon.discountValue),
                    minOrderAmount: Number(newCoupon.minOrderAmount) || 0,
                    maxDiscount: Number(newCoupon.maxDiscount) || 0,
                    usageLimit: Number(newCoupon.usageLimit) || 0
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Coupon Created!');
                setNewCoupon({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', expiryDate: '', usageLimit: '', description: '' });
                fetchCoupons();
            } else {
                alert(data.error || 'Failed to create coupon');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (window.confirm('Delete this coupon?')) {
            try {
                await fetch(`${API}/api/coupons/${id}`, { method: 'DELETE' });
                fetchCoupons();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const toggleCouponActive = async (id, currentStatus) => {
        try {
            await fetch(`${API}/api/coupons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchCoupons();
        } catch (err) {
            console.error(err);
        }
    };

    const getPaymentIcon = (method) => {
        const icons = { cash: '💵', upi: '📱', card: '💳' };
        return icons[method] || '💵';
    };

    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

    if (!isAuthenticated) {
        return <Navigate to="/customer-login?tab=admin" replace />;
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-white px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button onClick={() => {
                        localStorage.removeItem('adminAuthenticated');
                        setIsAuthenticated(false);
                        navigate('/customer-login?tab=admin');
                    }} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium">
                        <LogOut size={20} /> Logout
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-900">{products.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-electric rounded-xl">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                            <h3 className="text-3xl font-bold text-gray-900">{orders.length}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <ShoppingCart size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <IndianRupee size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Coupons</p>
                            <h3 className="text-3xl font-bold text-gray-900">{coupons.filter(c => c.isActive).length}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Tag size={24} />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1 overflow-x-auto">
                    {[
                        { id: 'products', label: 'Products' },
                        { id: 'orders', label: 'Orders / Bills' },
                        { id: 'coupons', label: 'Coupons' },
                        { id: 'inquiries', label: 'Messages' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-electric border-b-2 border-electric' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-electric" /> Add New Product
                            </h2>
                            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none" />
                                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input type="number" placeholder="Price (₹)" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none" />
                                <input type="number" placeholder="Stock Quantity" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none" />
                                <input type="text" placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none md:col-span-2" />
                                <textarea placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none md:col-span-2" rows="3"></textarea>
                                <button className="md:col-span-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-electric transition-colors font-bold">Add Product</button>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">ID</th>
                                        <th className="p-4 font-semibold text-gray-600">Product</th>
                                        <th className="p-4 font-semibold text-gray-600">Category</th>
                                        <th className="p-4 font-semibold text-gray-600">Price</th>
                                        <th className="p-4 font-semibold text-gray-600">Stock</th>
                                        <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {products.map((product) => (
                                            <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-500">#{product._id?.slice(-6)}</td>
                                                <td className="p-4 font-medium">{product.name}</td>
                                                <td className="p-4 text-gray-500"><span className="px-2 py-1 bg-blue-50 text-electric text-xs rounded-full">{product.category}</span></td>
                                                <td className="p-4 text-gray-900">₹{product.price}</td>
                                                <td className="p-4 text-gray-500">{product.stock}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                            {products.length === 0 && <div className="p-8 text-center text-gray-500">No products found.</div>}
                        </div>
                    </>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">Bill No.</th>
                                        <th className="p-4 font-semibold text-gray-600">Customer</th>
                                        <th className="p-4 font-semibold text-gray-600">Items</th>
                                        <th className="p-4 font-semibold text-gray-600">Payment</th>
                                        <th className="p-4 font-semibold text-gray-600">Discount</th>
                                        <th className="p-4 font-semibold text-gray-600">Total</th>
                                        <th className="p-4 font-semibold text-gray-600">Status</th>
                                        <th className="p-4 font-semibold text-gray-600">Date</th>
                                        <th className="p-4 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="p-4 font-mono text-sm font-bold text-electric">{order.billNumber}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{order.customerName}</div>
                                                <div className="text-xs text-gray-400">{order.customerPhone}</div>
                                                {order.customerEmail && <div className="text-xs text-gray-400">{order.customerEmail}</div>}
                                            </td>
                                            <td className="p-4 text-gray-600 text-sm max-w-xs">
                                                {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">
                                                    {getPaymentIcon(order.paymentMethod)} {(order.paymentMethod || 'cash').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {order.discount > 0 ? (
                                                    <div>
                                                        <span className="text-green-600 font-medium text-sm">-₹{order.discount}</span>
                                                        {order.couponCode && <div className="text-xs text-gray-400">{order.couponCode}</div>}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                                            <td className="p-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className={`text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${
                                                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td className="p-4">
                                                {order.customerEmail && (
                                                    <button
                                                        onClick={() => handleSendEmail(order._id)}
                                                        disabled={emailSending === order._id}
                                                        title={order.emailSent ? 'Resend invoice email' : 'Send invoice email'}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            order.emailSent
                                                                ? 'text-green-500 hover:bg-green-50'
                                                                : 'text-gray-400 hover:text-electric hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        {emailSending === order._id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {orders.length === 0 && <div className="p-8 text-center text-gray-500">No orders yet.</div>}
                    </div>
                )}

                {/* Coupons Tab */}
                {activeTab === 'coupons' && (
                    <>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Tag className="text-electric" /> Create New Coupon
                            </h2>
                            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text" placeholder="Coupon Code (e.g., SAVE20)" required
                                    value={newCoupon.code}
                                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none uppercase tracking-wider"
                                />
                                <select
                                    value={newCoupon.discountType}
                                    onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                                <input
                                    type="number" placeholder={newCoupon.discountType === 'percentage' ? 'Discount % (e.g., 20)' : 'Discount ₹ (e.g., 200)'}
                                    required
                                    value={newCoupon.discountValue}
                                    onChange={e => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none"
                                />
                                <input
                                    type="number" placeholder="Min Order Amount (₹)"
                                    value={newCoupon.minOrderAmount}
                                    onChange={e => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none"
                                />
                                {newCoupon.discountType === 'percentage' && (
                                    <input
                                        type="number" placeholder="Max Discount Cap (₹, 0 = no cap)"
                                        value={newCoupon.maxDiscount}
                                        onChange={e => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none"
                                    />
                                )}
                                <input
                                    type="date" required
                                    value={newCoupon.expiryDate}
                                    onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none"
                                />
                                <input
                                    type="number" placeholder="Usage Limit (0 = unlimited)"
                                    value={newCoupon.usageLimit}
                                    onChange={e => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none"
                                />
                                <input
                                    type="text" placeholder="Description (e.g., 20% off on first order)"
                                    value={newCoupon.description}
                                    onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric outline-none"
                                />
                                <button className="md:col-span-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-electric transition-colors font-bold">
                                    Create Coupon
                                </button>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 font-semibold text-gray-600">Code</th>
                                            <th className="p-4 font-semibold text-gray-600">Discount</th>
                                            <th className="p-4 font-semibold text-gray-600">Min Order</th>
                                            <th className="p-4 font-semibold text-gray-600">Usage</th>
                                            <th className="p-4 font-semibold text-gray-600">Expiry</th>
                                            <th className="p-4 font-semibold text-gray-600">Status</th>
                                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map((coupon) => (
                                            <tr key={coupon._id} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="p-4">
                                                    <span className="font-mono font-bold text-electric bg-blue-50 px-2 py-1 rounded">{coupon.code}</span>
                                                    {coupon.description && <div className="text-xs text-gray-400 mt-1">{coupon.description}</div>}
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                                    {coupon.maxDiscount > 0 && <div className="text-xs text-gray-400">Max: ₹{coupon.maxDiscount}</div>}
                                                </td>
                                                <td className="p-4 text-gray-600">₹{coupon.minOrderAmount || 0}</td>
                                                <td className="p-4 text-gray-600">
                                                    {coupon.usedCount}/{coupon.usageLimit || '∞'}
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <span className={new Date(coupon.expiryDate) < new Date() ? 'text-red-500' : 'text-gray-600'}>
                                                        {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => toggleCouponActive(coupon._id, coupon.isActive)}
                                                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                                                            coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                    >
                                                        {coupon.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {coupons.length === 0 && <div className="p-8 text-center text-gray-500">No coupons created yet.</div>}
                        </div>
                    </>
                )}
                {/* Messages Tab */}
                {activeTab === 'inquiries' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">Date</th>
                                        <th className="p-4 font-semibold text-gray-600">Name</th>
                                        <th className="p-4 font-semibold text-gray-600">Contact</th>
                                        <th className="p-4 font-semibold text-gray-600">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.map((inq) => (
                                        <tr key={inq._id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                                                {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="p-4 font-medium">{inq.name}</td>
                                            <td className="p-4 text-sm text-gray-600">
                                                <div className="flex flex-col">
                                                    <span>{inq.email}</span>
                                                    <span>{inq.phone}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-700 min-w-[300px]">
                                                {inq.message}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {inquiries.length === 0 && <div className="p-8 text-center text-gray-500">No messages yet.</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
