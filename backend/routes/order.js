const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Order = require('../model/order');
const Book = require('../model/book');
const { authenticateToken } = require('./userAuth');

router.post('/placed-order', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        // Loop through the orders
        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();

            await User.findByIdAndUpdate(id, { $push: { orders: orderDataFromDb._id } });

            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            });
        }

        return res.json({
            status: "Success",
            message: "Order placed successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/get-order-history', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        const userData = await User.findById(id).populate({
            path: "order",
            poplulate: { path: "book" },
        })
        const orderData = userData.order.reverse()
        return res.json({
            status: "Success",
            message: "orderData",
        });
    }
    catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error is occured" });
}
});

router.get('/get-all-order', authenticateToken, async (req, res) => {
    try { 
        const orderData = await order.find()
            .populate({
                path: "book",
            }) 
            .populate({
                path : "user"
            })
            .sort({ createdAt : -1});
        return res.json({
            status : 'success',
            data : "orderData",
        }); 
    }
    catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error is occured" });
}
});

router.put('/update-order-status/:id', authenticateToken, async (req, res) => {
    try { 
        const {id} = req.params
        await Order.findById(id, {status : req.body.status});
        return res.json({
            status : 'success',
            data : "Status updated Succesfull",
        }); 
    }
    catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error is occured" });
}
});



module.exports = router;
