const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId:{
        type:String
    },
    body:{
        type:String
    },
    image:{
        type:String
    },
    image2:{
        type:String
    },
    comments:[],
    likes:[],
    date:{
        type:Date,
        default:Date.now
    },
})

module.exports = mongoose.model('Post',postSchema);