import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, ArrowLeft, Clock, CheckCircle, XCircle, Download, Printer, Mail, Loader2, ShoppingBag, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(null);
    const billRefs = useRef({});
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('customer') || 'null');
        if (stored) {
            setCustomer(stored);
            fetchOrders(stored.email);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchOrders = async (email) => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/orders/customer/${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.data) setOrders(data.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Pending' },
            completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Completed' },
            cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled' }
        };
        return configs[status] || configs.pending;
    };

    const getPaymentLabel = (method) => {
        const labels = { cash: '💵 Cash', upi: '📱 UPI', card: '💳 Card' };
        return labels[method] || method || 'Cash';
    };

    const handleDownloadPDF = async (order) => {
        setPdfLoading(order._id);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = billRefs.current[order._id];
            if (!element) return;
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `Bill-${order.billNumber}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(element).save();
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setPdfLoading(null);
        }
    };

    const handlePrint = (order) => {
        const element = billRefs.current[order._id];
        if (!element) return;
        const printContent = element.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`
            <html>
            <head>
                <title>Bill - ${order.billNumber}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background: #f0f4ff; text-align: left; padding: 10px; border-bottom: 2px solid #ddd; font-size: 13px; color: #1e40af; }
                    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        win.document.close();
        win.print();
    };

    if (!customer) {
        return (
            <div className="pt-24 min-h-screen bg-gold-50 pb-20">
                <div className="max-w-2xl mx-auto px-4 text-center py-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">Login Required</h2>
                        <p className="text-gray-400 mb-6">Please login to view your order history</p>
                        <Link
                            to="/customer-login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <LogIn size={18} />
                            Login Now
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gold-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/products" className="text-gray-400 hover:text-electric transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-400 text-sm mt-1">Welcome back, {customer.name}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-400 mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-6">Start shopping to see your order history here</p>
                        <Link to="/products" className="px-6 py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => {
                            const statusConfig = getStatusConfig(order.status);
                            const StatusIcon = statusConfig.icon;
                            const isExpanded = expandedOrder === order._id;

                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl ${statusConfig.bg}`}>
                                                <Package size={22} className={statusConfig.color} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className="font-bold text-electric font-mono text-sm">{order.billNumber}</span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                                                        {statusConfig.label}
                                                    </span>
                                                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                                        {getPaymentLabel(order.paymentMethod)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {' · '}
                                                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
                                            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                        </div>
                                    </button>

                                    {/* Expanded Order Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-gray-100 p-5">
                                                    {/* Action buttons */}
                                                    <div className="flex gap-2 mb-4 flex-wrap">
                                                        <button
                                                            onClick={() => handleDownloadPDF(order)}
                                                            disabled={pdfLoading === order._id}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium disabled:opacity-50"
                                                        >
                                                            {pdfLoading === order._id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                                            Download PDF
                                                        </button>
                                                        <button
                                                            onClick={() => handlePrint(order)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-electric text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
                                                        >
                                                            <Printer size={14} />
                                                            Print
                                                        </button>
                                                    </div>

                                                    {/* Bill content for PDF/Print */}
                                                    <div ref={el => billRefs.current[order._id] = el} className="bg-gray-50 rounded-xl p-5">
                                                        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #1e40af', paddingBottom: '15px' }}>
                                                            <h2 style={{ fontSize: '20px', margin: 0, color: '#1e40af', letterSpacing: '2px' }}>SRI VELA ELECTRICAL SHOP</h2>
                                                            <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>Quality Electrical Products & Solutions · +91 90038 21871</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '13px' }}>
                                                            <div>
                                                                <p style={{ margin: '3px 0' }}><strong>Bill No:</strong> {order.billNumber}</p>
                                                                <p style={{ margin: '3px 0' }}><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                                                                <p style={{ margin: '3px 0' }}><strong>Payment:</strong> {getPaymentLabel(order.paymentMethod)}</p>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <p style={{ margin: '3px 0' }}><strong>Customer:</strong> {order.customerName}</p>
                                                                <p style={{ margin: '3px 0' }}><strong>Phone:</strong> {order.customerPhone}</p>
                                                            </div>
                                                        </div>

                                                        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd', fontSize: '12px', color: '#1e40af' }}>#</th>
                                                                    <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd', fontSize: '12px', color: '#1e40af' }}>Product</th>
                                                                    <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd', fontSize: '12px', color: '#1e40af' }}>Price</th>
                                                                    <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd', fontSize: '12px', color: '#1e40af' }}>Qty</th>
                                                                    <th style={{ background: '#f0f4ff', textAlign: 'right', padding: '8px', borderBottom: '2px solid #ddd', fontSize: '12px', color: '#1e40af' }}>Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {order.items.map((item, i) => (
                                                                    <tr key={i}>
                                                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{i + 1}</td>
                                                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{item.name}</td>
                                                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '13px' }}>₹{item.price}</td>
                                                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{item.quantity}</td>
                                                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right', fontSize: '13px' }}>₹{item.price * item.quantity}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                        <div style={{ textAlign: 'right', fontSize: '13px' }}>
                                                            <p style={{ margin: '4px 0' }}>Subtotal: ₹{order.subtotal}</p>
                                                            {order.discount > 0 && (
                                                                <p style={{ margin: '4px 0', color: '#16a34a' }}>
                                                                    Discount{order.couponCode ? ` (${order.couponCode})` : ''}: -₹{order.discount}
                                                                </p>
                                                            )}
                                                            <p style={{ margin: '4px 0' }}>GST (18%): ₹{order.gst}</p>
                                                            <p style={{ fontSize: '18px', fontWeight: 'bold', borderTop: '2px solid #1e40af', paddingTop: '8px', marginTop: '8px', color: '#1e40af' }}>
                                                                Total: ₹{order.totalAmount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
