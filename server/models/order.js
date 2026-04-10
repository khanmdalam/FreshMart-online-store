const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: false
            },
            productName: {
                type: String,
                trim: true
            },
            productImage: {
                type: String,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    deliveryAddress: {
        street: String,
        city: String,
        pincode: String,
        state: String
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    statusTimeline: [
        {
            status: {
                type: String,
                enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                required: true
            },
            changedAt: {
                type: Date,
                required: true,
                default: Date.now
            }
        }
    ],
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
}, { timestamps: true })
module.exports = mongoose.model('Order', orderSchema)
