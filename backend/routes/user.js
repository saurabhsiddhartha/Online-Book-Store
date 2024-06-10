const router = require("express").Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {authenticateToken}  =require('./userAuth')

// Sign-Up Route
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Validate input
        if (typeof username !== 'string' || username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 4" });
        }

        if (typeof email !== 'string') {
            return res.status(400).json({ message: "Email must be a valid string" });
        }

        // Convert password to string if it is a number
        const passwordStr = String(password);

        if (passwordStr.length < 4) {
            return res.status(400).json({ message: "Password length should be greater than 4" });
        }

        // Check if username or email already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(passwordStr, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            address,
        });

        await newUser.save();
        return res.status(200).json({ message: "Sign-Up Successfully" });
    } catch (err) {
        console.error('Sign-Up Error:', err);  // Log the error to the console
        return res.status(500).json({ message: "Internal Server Error in Sign-Up" });
    }
});

// Sign-In Route
router.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Convert password to string if it is a number
        const passwordStr = String(password);

        // Validate input
        if (typeof username !== 'string' || typeof passwordStr !== 'string') {
            return res.status(400).json({ message: "Invalid username or password format" });
        }

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Username doesn't exist" });
        }

        const isMatch = await bcrypt.compare(passwordStr, existingUser.password);
        if (isMatch) {
            // Create token
            const token = jwt.sign(
                {
                    id: existingUser._id,
                    username: existingUser.username,
                    role: existingUser.role
                },
                "bookStore123",
                { expiresIn: '30d' }
            );

            return res.status(200).json({
                id: existingUser._id,
                username: existingUser.username,
                role: existingUser.role,
                token: token
            });
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        console.error('Sign-In Error:', err);  // Log the error to the console
        return res.status(500).json({ message: "Internal Server Error in Login" });
    }
});


router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Get user ID from req.user set by authenticateToken middleware
        const data = await User.findById(userId).select('-password');
        
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/update-address' ,authenticateToken,async(req,res) =>{
    try{
        const {id} = req.headers
        const {address}  = req.body;
        await User.findByIdAndUpdate(id ,{address ,address});
        return res.status(200).json({message : "Address Updated"})
    }catch(err){
        res.status(400).json({message : "Internal Error"})
    }
} )
module.exports = router;
