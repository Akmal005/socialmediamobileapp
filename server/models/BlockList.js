const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockUserSchema = new Schema({
    userId:{
        type:String
    },
    blockList:[],
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('BlockedUsers',BlockUserSchema);