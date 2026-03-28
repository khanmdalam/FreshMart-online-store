const express = require('express');
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDb is connected Successfully'))
.catch((err) => console.log(err))

app.listen(5000, () => {
    console.log('Server is runnig on port 5000');
})


