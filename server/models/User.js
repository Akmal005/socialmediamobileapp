const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    profilePicture:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    uid:{
        type:String
    }
})

module.exports = mongoose.model('User',userSchema);