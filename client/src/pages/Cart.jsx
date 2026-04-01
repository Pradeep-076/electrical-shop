import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, Printer, ArrowLeft, Download, Mail, Tag, CreditCard, Banknote, Smartphone, Check, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '' });
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [emailSending, setEmailSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailPreview, setEmailPreview] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const billRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(stored);
        const customer = JSON.parse(localStorage.getItem('customer') || 'null');
        if (customer) {
            setCustomerForm(prev => ({ ...prev, name: customer.name, email: customer.email }));
        }
    }, []);

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const updateQty = (index, delta) => {
        const newCart = [...cart];
        newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
        updateCart(newCart);
        // Reset coupon when cart changes
        if (couponApplied) {
            setCouponApplied(null);
            setCouponCode('');
        }
    };

    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        updateCart(newCart);
        if (couponApplied) {
            setCouponApplied(null);
            setCouponCode('');
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = couponApplied ? couponApplied.discount : 0;
    const taxableAmount = subtotal - discount;
    const gst = Math.round(taxableAmount * 0.18);
    const total = taxableAmount + gst;

    // Apply coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await fetch('http://localhost:5000/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, orderAmount: subtotal })
            });
            const data = await res.json();
            if (res.ok) {
                setCouponApplied(data.data);
                setCouponError('');
            } else {
                setCouponError(data.error);
                setCouponApplied(null);
            }
        } catch (err) {
            setCouponError('Failed to validate coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setCouponApplied(null);
        setCouponCode('');
        setCouponError('');
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: customerForm.name,
                    customerEmail: customerForm.email,
                    customerPhone: customerForm.phone,
                    paymentMethod,
                    couponCode: couponApplied ? couponApplied.code : '',
                    discount: discount,
                    items: cart.map(item => ({
                        productId: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                })
            });
            const data = await res.json();
            if (res.ok) {
                setOrder(data.data);
                localStorage.removeItem('cart');
                setCart([]);
            } else {
                setError(data.error || 'Failed to place order');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printContent = billRef.current.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`
            <html>
            <head>
                <title>Bill - ${order.billNumber}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                    .bill-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px; }
                    .bill-header h1 { font-size: 24px; margin: 0; color: #1e40af; }
                    .bill-header p { margin: 5px 0; color: #666; font-size: 14px; }
                    .bill-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background: #f0f4ff; text-align: left; padding: 10px; border-bottom: 2px solid #ddd; font-size: 14px; color: #1e40af; }
                    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
                    .totals { margin-top: 20px; text-align: right; }
                    .totals p { margin: 5px 0; font-size: 14px; }
                    .totals .total { font-size: 18px; font-weight: bold; border-top: 2px solid #1e40af; padding-top: 10px; color: #1e40af; }
                    .discount { color: #16a34a; }
                    .payment-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #f0f4ff; color: #1e40af; }
                    .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        win.document.close();
        win.print();
    };

    // Download PDF
    const handleDownloadPDF = async () => {
        setPdfLoading(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = billRef.current;
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
            alert('PDF download failed. Please use Print instead.');
        } finally {
            setPdfLoading(false);
        }
    };

    // Send email invoice
    const handleSendEmail = async () => {
        if (!order.customerEmail) {
            alert('No email address available for this order.');
            return;
        }
        setEmailSending(true);
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${order._id}/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok) {
                setEmailSent(true);
                if (data.preview) {
                    setEmailPreview(data);
                }
            } else {
                alert(data.error || 'Failed to send email');
            }
        } catch (err) {
            alert('Failed to send email. Server may be offline.');
        } finally {
            setEmailSending(false);
        }
    };

    const paymentMethods = [
        { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-green-600 bg-green-50 border-green-200', activeColor: 'bg-green-100 border-green-500 ring-2 ring-green-200' },
        { id: 'upi', label: 'UPI', icon: Smartphone, color: 'text-purple-600 bg-purple-50 border-purple-200', activeColor: 'bg-purple-100 border-purple-500 ring-2 ring-purple-200' },
        { id: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-200', activeColor: 'bg-blue-100 border-blue-500 ring-2 ring-blue-200' },
    ];

    const getPaymentLabel = (method) => {
        const labels = { cash: '💵 Cash', upi: '📱 UPI', card: '💳 Card' };
        return labels[method] || method;
    };

    // Bill view after order placed
    if (order) {
        return (
            <div className="pt-24 min-h-screen bg-gold-50 pb-20">
                <div className="max-w-3xl mx-auto px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                            <h2 className="text-2xl font-bold text-green-600">✅ Order Placed!</h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Download PDF */}
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={pdfLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
                                >
                                    {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                    {pdfLoading ? 'Generating...' : 'Download PDF'}
                                </button>

                                {/* Print */}
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    <Printer size={16} />
                                    Print
                                </button>

                                {/* Email Invoice */}
                                {order.customerEmail && (
                                    <button
                                        onClick={handleSendEmail}
                                        disabled={emailSending || emailSent}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                                            emailSent
                                                ? 'bg-green-100 text-green-700 border border-green-300'
                                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                        } disabled:opacity-70`}
                                    >
                                        {emailSending ? (
                                            <><Loader2 size={16} className="animate-spin" /> Sending...</>
                                        ) : emailSent ? (
                                            <><Check size={16} /> Email Sent</>
                                        ) : (
                                            <><Mail size={16} /> Email Invoice</>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Email preview notice */}
                        {emailPreview && emailPreview.preview && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg">
                                ⚠️ SMTP not configured. In production, configure SMTP_USER and SMTP_PASS to send real emails.
                            </div>
                        )}

                        <div ref={billRef}>
                            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1e40af', paddingBottom: '20px' }}>
                                <h1 style={{ fontSize: '24px', margin: 0, color: '#1e40af', letterSpacing: '2px' }}>SRI VELA ELECTRICAL SHOP</h1>
                                <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>Quality Electrical Products & Solutions</p>
                                <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>Contact: +91 90038 21871</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
                                <div>
                                    <p style={{ margin: '4px 0' }}><strong>Bill No:</strong> {order.billNumber}</p>
                                    <p style={{ margin: '4px 0' }}><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                                    <p style={{ margin: '4px 0' }}><strong>Payment:</strong> {getPaymentLabel(order.paymentMethod)}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '4px 0' }}><strong>Customer:</strong> {order.customerName}</p>
                                    <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {order.customerPhone}</p>
                                    {order.customerEmail && <p style={{ margin: '4px 0' }}><strong>Email:</strong> {order.customerEmail}</p>}
                                </div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                                <thead>
                                    <tr>
                                        <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd', fontSize: '13px', color: '#1e40af' }}>#</th>
                                        <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd', fontSize: '13px', color: '#1e40af' }}>Product</th>
                                        <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd', fontSize: '13px', color: '#1e40af' }}>Price</th>
                                        <th style={{ background: '#f0f4ff', textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd', fontSize: '13px', color: '#1e40af' }}>Qty</th>
                                        <th style={{ background: '#f0f4ff', textAlign: 'right', padding: '10px', borderBottom: '2px solid #ddd', fontSize: '13px', color: '#1e40af' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{i + 1}</td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.name}</td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>₹{item.price}</td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>Subtotal: ₹{order.subtotal}</p>
                                {order.discount > 0 && (
                                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#16a34a' }}>
                                        Discount{order.couponCode ? ` (${order.couponCode})` : ''}: -₹{order.discount}
                                    </p>
                                )}
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>GST (18%): ₹{order.gst}</p>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', borderTop: '2px solid #1e40af', paddingTop: '10px', marginTop: '10px', color: '#1e40af' }}>
                                    Total: ₹{order.totalAmount}
                                </p>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '30px', color: '#999', fontSize: '12px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <p>Thank you for your purchase!</p>
                                <p>SRI VELA ELECTRICAL SHOP — Powering Your Future</p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <Link to="/products" className="flex-1 text-center py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors">
                                Continue Shopping
                            </Link>
                            <Link to="/" className="flex-1 text-center py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                Go Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gold-50 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/products" className="text-gray-400 hover:text-electric transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <span className="text-gray-400 text-sm">({cart.length} items)</span>
                </div>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-400 mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Add products to start billing</p>
                        <Link to="/products" className="px-6 py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item._id || index}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                                >
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ShoppingBag size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                        <p className="text-electric font-bold">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQty(index, -1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQty(index, 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <p className="font-bold text-gray-900 w-20 text-right">₹{item.price * item.quantity}</p>
                                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))}

                            {/* Coupon Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <Tag size={16} className="text-electric" />
                                    Have a Coupon?
                                </h3>
                                {couponApplied ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <Check size={18} className="text-green-600" />
                                            <div>
                                                <span className="font-bold text-green-700">{couponApplied.code}</span>
                                                <span className="text-green-600 text-sm ml-2">— ₹{couponApplied.discount} off</span>
                                                {couponApplied.description && (
                                                    <p className="text-xs text-green-500 mt-0.5">{couponApplied.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={removeCoupon} className="text-green-500 hover:text-red-500 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Enter coupon code"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none text-sm uppercase tracking-wider"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="px-5 py-2 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {couponLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-red-500 text-xs mt-2">{couponError}</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Billing Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Bill Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount {couponApplied ? `(${couponApplied.code})` : ''}</span>
                                            <span>-₹{discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <span>GST (18%)</span>
                                        <span>₹{gst}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3">
                                        <span>Total</span>
                                        <span className="text-electric">₹{total}</span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-5">
                                    <h3 className="text-sm font-bold text-gray-700 mb-3">Payment Method</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {paymentMethods.map(method => {
                                            const Icon = method.icon;
                                            const isActive = paymentMethod === method.id;
                                            return (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                                                        isActive ? method.activeColor : method.color
                                                    }`}
                                                >
                                                    <Icon size={20} />
                                                    {method.label}
                                                    {isActive && <Check size={12} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handlePlaceOrder} className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-700">Customer Details</h3>
                                    <input
                                        type="text" required
                                        value={customerForm.name}
                                        onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none text-sm"
                                    />
                                    <input
                                        type="tel" required
                                        value={customerForm.phone}
                                        onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none text-sm"
                                    />
                                    <input
                                        type="email"
                                        value={customerForm.email}
                                        onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                                        placeholder="Email (for invoice)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric outline-none text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-electric text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-electric/30 disabled:opacity-50"
                                    >
                                        {loading ? 'Placing Order...' : `Generate Bill — ₹${total}`}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
