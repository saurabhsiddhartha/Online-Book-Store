const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    favorite: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }], 
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: 'Order',
    }]
}, { timestamps: true });

// Create a model from the schema-0
const User = mongoose.model('User', userSchema);

module.exports = User;
