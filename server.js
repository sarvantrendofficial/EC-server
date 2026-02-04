const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// import routes
const Products = require('./Routes/productRoute');
const Orders = require('./Routes/orderRoute');
const Admin = require('./Routes/adminRoute');
const Users = require('./Routes/usersRoute');
const Profile = require('./Routes/profileRoute');
const Cart = require('./Routes/cartRoute');

// use routes
app.use('/api/v1/profile', Profile);
app.use('/api/v1/product', Products);
app.use('/api/v1/orders', Orders);
app.use('/api/v1/admin', Admin);
app.use('/api/v1/users', Users);
app.use('/api/v1/cart', Cart);

mongoose.connect(process.env.MONGODB_URL, {
    dbname: "EasiShop"
}).then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log(err));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})