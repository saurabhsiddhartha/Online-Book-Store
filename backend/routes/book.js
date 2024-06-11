const router = require("express").Router();
const Book = require('../model/book');
const User = require('../model/user'); 
const jwt = require('jsonwebtoken');
const {authenticateToken}  =require('./userAuth')

router.post('/add-book',authenticateToken , async(req,res)=>{
    try{
        const { id } = req.headers
        const user = await User.findById(id)
        if(user.role !== 'admin'){
            return res.status(400).json({message : "You are not authorized to do admin work"})
        }
        const newBook = new Book({
            url : req.body.url,
            title: req.body.title,
            auther : req.body.auther,
            price : req.body.price,
            desc : req.body.desc,
            language : req.body.language
        })
        await newBook.save();
        res.status(200).json({message : "Book added SuccesFully"})
    }catch(err){
        console.log(err)
        res.status(400).json({message : "Internal Server Error in adding book"})
    }
})


router.put('/update-book',authenticateToken , async(req,res)=>{
    try{
        const {bookId} = req.headers
        
        console.log(bookId)
        const book = await Book.findByIdAndUpdate(bookId)
         
        const newBook = new Book({
            url : req.body.url,
            title: req.body.title,
            auther : req.body.auther,
            price : req.body.price,
            desc : req.body.desc,
            language : req.body.language
        })
        await newBook.save();
        res.status(200).json({message : "Book Updated SuccesFully"})
    }catch(err){
        console.log(err)
        res.status(400).json({message : "An error occured"})
    }
})

router.delete('/delete-book', authenticateToken, async (req, res) => {
    try {
        const {bookid} =  req.headers

        console.log(bookId)
      
         await Book.findByIdAndDelete(bookid);
 
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.get('/get-all-book', authenticateToken, async (req, res) => {
    try {
      
        const books = await Book.find().sort({createdAt : -1});
        return res.json({
            status : "success",
            data : books,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.get('/get-recent-book', async (req, res) => {
    try {
      
        const books = await Book.find().sort({createdAt : -1}).limit(4);
        return res.json({
            status : "success",
            data : books,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.get('/get-book-by-id/:id', authenticateToken, async (req, res) => {
    try {
       const {id} = req.params;
        const books = await Book.findById(id)
        return res.json({
            status : "success",
            data : books,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
});
module.exports = router;
