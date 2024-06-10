const express = require('express'); 
require('dotenv').config();
const {}  = require('./dbConnection/Connection')
const app = express();
app.use(express.json())
const user = require('./routes/user')
const books = require('./routes/book')
const favourite = require('./routes/favorites')
const cart = require('./routes/cart')
// const order = require('./routes/order')

app.use("/ap1/v1", user);
app.use("/ap1/v1", books);
app.use("/ap1/v1", favourite);
app.use("/ap1/v1", cart);
// app.use("/ap1/v1", order);
const port = process.env.PORT || 3000;  

app.listen(port, () => {
    console.log(`Server is running at ${port}...`);
});
