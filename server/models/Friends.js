const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    friendId:{
        type:String
    },
    currentUserId:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },  
    otherUser:{
        type:Object
    },
    currentUser:{
        type:Object
    }

})

module.exports = mongoose.model('Friends',friendSchema);