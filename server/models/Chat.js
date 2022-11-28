const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema ({
    otherUserId:{
        type:String
    },
    currentUserId:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    message:{
        type:String
    },
    uid:{
        type:String
    },
    otherUser:{
        type:String
    },
    currentUser:{
        tyep:Object
    },
    image:{
        tyep:String
    }
})

module.exports = mongoose.model('Chat', chatSchema)