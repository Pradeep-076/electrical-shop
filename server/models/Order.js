const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    billNumber: { type: String, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'upi', 'card'], default: 'cash' },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    emailSent: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-generate bill number before saving
orderSchema.pre('save', async function (next) {
    if (!this.billNumber) {
        const count = await mongoose.model('Order').countDocuments();
        const date = new Date();
        const prefix = `SV${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
        this.billNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
