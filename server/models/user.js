const mongoose = require ('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true
    },
    email:{
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
        city : String,
        state : String,
        pincode : String

    },
    role : {
        type : String,
        enum : ['customer', 'admin'],
        default : 'customer'
    }
}, {timestamps : true});

module.exports = mongoose.model('user', userSchema);