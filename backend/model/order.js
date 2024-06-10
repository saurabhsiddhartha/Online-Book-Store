const mongoose = require('mongoose');

const order = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    status: {
        type: String,
        default: "order placed",
        enum: ["order placed", "out for delivery", "delivered", "canceled"]
    }
}, { timestamps: true });

const Order = mongoose.model('Order', order);

module.exports = Order;
