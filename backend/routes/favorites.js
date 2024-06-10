const router = require("express").Router(); 
const jwt = require('jsonwebtoken');

const User = require('../model/user');  
const { authenticateToken } = require('./userAuth');

router.put('/add-to-favourite', authenticateToken, async (req, res) => {
    try {
        const {id ,bookid } = req.headers;  
        
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
            }
 
        const isBookFavourite = userData.favorite.includes(bookid);
        if (isBookFavourite) {
            return res.status(200).json({ message: "Book is already in favorites" });
        }

        // Add the book to the user's favorites
        await User.findByIdAndUpdate(id, { $push: { favorite: bookid } }); 
        return res.status(200).json({ message: "Added to favorite" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal error in adding book to favorite" });
    }
});


router.put('/remove-from-favourite', authenticateToken, async (req, res) => {
    try {
        const {id ,bookid } = req.headers;  
        
        const userData = await User.findById(id); 
        const isBookFavourite = userData.favorite.includes(bookid); 
        if(!isBookFavourite){
            return res.status(200).json({message : " Already Removed"})
        }
        await User.findByIdAndUpdate(id, { $pull: { favorite: bookid } }); 
        return res.status(200).json({ message: "Removed from favourite" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal error in adding book to favorite" });
    }
});

router.get('/get-favourite-book', authenticateToken, async (req, res) => {
    try {
        const {id  } = req.headers;  
        
        const userData = await User.findById(id).populate('favorite');
        const favouriteBook = userData.favorite;
        if(!favouriteBook){
            return res.status(200).json({message : "You don't any book"})
        } 
        return res.json(
            {status : "success",
            data : favouriteBook}
        )
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;
