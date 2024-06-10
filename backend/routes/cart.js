const router = require("express").Router(); 
const User = require('../model/user');  
const { authenticateToken } = require('./userAuth');

router.put('/add-to-cart', authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers; 
        const userData = await User.findById(id);
        
        const isBookInCart = userData.cart.includes(bookid);
        if (isBookInCart) {
            return res.json({
                status: "success",
                data: "Book is Already in Cart"
            });
        }

        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid }
        });

        return res.json({
            status: "success",
            data: "Book is Added to Cart"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.put('/remove-from-cart/:bookid', authenticateToken, async (req, res) => {
    try {
        const { bookid} = req.params; 
        const { id} = req.headers; 
        const userData = await User.findById(id); 
         
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid }
        });

        return res.json({
            status: "success",
            data: "Book is Remove to Cart"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.get('/get-user-cart', authenticateToken, async (req, res) => {
    try {
        const {id  } = req.headers;   
        const userData = await User.findById(id).populate('cart');
        const cartDetails = userData.cart.reverse();
        if(!cartDetails){
            return res.status(200).json({message : "Cart is Empty"})
        } 
        return res.json(
            {status : "success",
            data : cartDetails}
        )
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

module.exports = router;
