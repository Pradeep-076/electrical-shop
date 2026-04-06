const express = require("express");
const cors = require("cors");
const connectDB = require('./db');
const Product = require('./models/Product');
const Inquiry = require('./models/Inquiry');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://electrical-shop-nine.vercel.app"
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('Sri Vela Electrical Shop API Running');
});

// ========================
// PRODUCTS ROUTES
// ========================

// Get all products (with optional category & search filters)
app.get('/api/products', async (req, res) => {
    try {
        const { category, search } = req.query;
        let filter = {};

        if (category && category !== 'All') {
            filter.category = category;
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(filter);
        res.json({ message: 'success', data: products });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add a product
app.post('/api/products', async (req, res) => {
    try {
        const { name, category, price, description, imageUrl, stock } = req.body;
        const product = new Product({ name, category, price, description, imageUrl, stock });
        const saved = await product.save();
        res.json({ message: 'success', data: saved, id: saved._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, category, price, description, imageUrl, stock } = req.body;
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, price, description, imageUrl, stock },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'success', data: updated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ========================
// INQUIRIES ROUTES
// ========================

app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({ message: 'success', data: inquiries });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, email, phone, message, productId } = req.body;
        const inquiry = new Inquiry({ name, email, phone, message, productId: productId || undefined });
        const saved = await inquiry.save();
        res.json({ message: 'success', id: saved._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ========================
// CUSTOMER AUTH ROUTES
// ========================

// Register
app.post('/api/customers/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if customer already exists
        const existing = await Customer.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const customer = new Customer({ name, email, phone, password });
        await customer.save();
        res.json({ message: 'Registration successful', id: customer._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
app.post('/api/customers/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await customer.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            customer: { id: customer._id, name: customer.name, email: customer.email, cart: customer.cart || [] }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update Customer Cart
app.put('/api/customers/:id/cart', async (req, res) => {
    try {
        const { cart } = req.body;
        const updated = await Customer.findByIdAndUpdate(
            req.params.id,
            { cart },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Cart updated', cart: updated.cart });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ========================
// COUPON ROUTES
// ========================

// Create coupon (admin)
app.post('/api/coupons', async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate, usageLimit, description } = req.body;
        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountType, discountValue, minOrderAmount, maxDiscount,
            expiryDate, usageLimit, description
        });
        const saved = await coupon.save();
        res.json({ message: 'Coupon created', data: saved });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all coupons (admin)
app.get('/api/coupons', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ message: 'success', data: coupons });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Validate & apply coupon
app.post('/api/coupons/validate', async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ error: 'Invalid coupon code' });
        }

        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ error: 'Coupon usage limit reached' });
        }

        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({ error: `Minimum order amount is ₹${coupon.minOrderAmount}` });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = Math.round(orderAmount * (coupon.discountValue / 100));
            if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        res.json({
            message: 'Coupon applied',
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount,
                description: coupon.description
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete coupon
app.delete('/api/coupons/:id', async (req, res) => {
    try {
        const deleted = await Coupon.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.json({ message: 'Coupon deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Toggle coupon active status
app.put('/api/coupons/:id', async (req, res) => {
    try {
        const { isActive } = req.body;
        const updated = await Coupon.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.json({ message: 'success', data: updated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ========================
// ORDERS / BILLING ROUTES
// ========================

// Create a new order/bill
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, message, items, paymentMethod, couponCode, discount } = req.body;

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = discount || 0;
        const taxableAmount = subtotal - discountAmount;
        const gst = Math.round(taxableAmount * 0.18);
        const totalAmount = taxableAmount + gst;

        const order = new Order({
            customerName, customerEmail, customerPhone, message,
            items, subtotal, gst, totalAmount,
            paymentMethod: paymentMethod || 'cash',
            couponCode: couponCode || '',
            discount: discountAmount
        });
        const saved = await order.save();

        // If coupon was used, increment usage count
        if (couponCode) {
            await Coupon.findOneAndUpdate(
                { code: couponCode.toUpperCase() },
                { $inc: { usedCount: 1 } }
            );
        }

        res.json({ message: 'Order placed successfully', data: saved });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all orders (admin)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ message: 'success', data: orders });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get customer orders by email
app.get('/api/orders/customer/:email', async (req, res) => {
    try {
        const orders = await Order.find({ customerEmail: req.params.email }).sort({ createdAt: -1 });
        res.json({ message: 'success', data: orders });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'success', data: order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update order status
app.put('/api/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'success', data: updated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ========================
// EMAIL INVOICE ROUTE
// ========================

app.post('/api/orders/:id/email', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (!order.customerEmail) {
            return res.status(400).json({ error: 'Customer email not available' });
        }

        // Build email HTML
        const itemRows = order.items.map((item, i) => `
            <tr>
                <td style="padding:10px;border-bottom:1px solid #eee;">${i + 1}</td>
                <td style="padding:10px;border-bottom:1px solid #eee;">${item.name}</td>
                <td style="padding:10px;border-bottom:1px solid #eee;">₹${item.price}</td>
                <td style="padding:10px;border-bottom:1px solid #eee;">${item.quantity}</td>
                <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">₹${item.price * item.quantity}</td>
            </tr>
        `).join('');

        const paymentLabel = { cash: '💵 Cash', upi: '📱 UPI', card: '💳 Card' }[order.paymentMethod] || order.paymentMethod;

        const emailHtml = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;color:white;">
                <h1 style="margin:0;font-size:24px;letter-spacing:2px;">SRI VELA ELECTRICAL SHOP</h1>
                <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">Quality Electrical Products & Solutions</p>
            </div>

            <div style="padding:32px;">
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
                    <p style="margin:0;color:#16a34a;font-weight:bold;font-size:18px;">✅ Order Confirmed!</p>
                    <p style="margin:4px 0 0;color:#666;font-size:14px;">Thank you for your purchase</p>
                </div>

                <div style="display:flex;justify-content:space-between;margin-bottom:24px;font-size:14px;">
                    <div>
                        <p style="margin:4px 0;"><strong>Bill No:</strong> ${order.billNumber}</p>
                        <p style="margin:4px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                        <p style="margin:4px 0;"><strong>Payment:</strong> ${paymentLabel}</p>
                    </div>
                    <div style="text-align:right;">
                        <p style="margin:4px 0;"><strong>Customer:</strong> ${order.customerName}</p>
                        <p style="margin:4px 0;"><strong>Phone:</strong> ${order.customerPhone}</p>
                    </div>
                </div>

                <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                    <thead>
                        <tr style="background:#f9fafb;">
                            <th style="padding:10px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:13px;color:#6b7280;">#</th>
                            <th style="padding:10px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:13px;color:#6b7280;">Product</th>
                            <th style="padding:10px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:13px;color:#6b7280;">Price</th>
                            <th style="padding:10px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:13px;color:#6b7280;">Qty</th>
                            <th style="padding:10px;text-align:right;border-bottom:2px solid #e5e7eb;font-size:13px;color:#6b7280;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                </table>

                <div style="text-align:right;margin-top:16px;font-size:14px;">
                    <p style="margin:4px 0;color:#666;">Subtotal: ₹${order.subtotal}</p>
                    ${order.discount > 0 ? `<p style="margin:4px 0;color:#16a34a;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}: -₹${order.discount}</p>` : ''}
                    <p style="margin:4px 0;color:#666;">GST (18%): ₹${order.gst}</p>
                    <p style="margin:12px 0 0;font-size:20px;font-weight:bold;color:#1e40af;border-top:2px solid #1e40af;padding-top:12px;">
                        Total: ₹${order.totalAmount}
                    </p>
                </div>
            </div>

            <div style="background:#f9fafb;padding:20px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;">Thank you for shopping with us!</p>
                <p style="margin:4px 0 0;">SRI VELA ELECTRICAL SHOP — Powering Your Future</p>
                <p style="margin:4px 0 0;">Contact: +91 90038 21871</p>
            </div>
        </div>
        `;

        // Configure email transporter
        // Using a test/demo transporter - configure with real SMTP credentials in production
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || ''
            }
        });

        // Check if SMTP is configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            // Mark as sent (demo mode) and return the HTML for client-side preview
            await Order.findByIdAndUpdate(req.params.id, { emailSent: true });
            return res.json({
                message: 'Email preview generated (SMTP not configured). Configure SMTP_USER and SMTP_PASS environment variables for actual sending.',
                preview: true,
                html: emailHtml
            });
        }

        await transporter.sendMail({
            from: `"Sri Vela Electrical Shop" <${process.env.SMTP_USER}>`,
            to: order.customerEmail,
            subject: `Invoice ${order.billNumber} - Sri Vela Electrical Shop`,
            html: emailHtml
        });

        await Order.findByIdAndUpdate(req.params.id, { emailSent: true });
        res.json({ message: 'Invoice email sent successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send email: ' + err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
