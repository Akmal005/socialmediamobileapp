const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const cors = require('cors');
const mongoose = require('mongoose');

const keys = require('./config/keys');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(keys.MongoDB)
.then(() => {
    console.log('Connected to MongoDB..')
})
.catch((error) => {
    console.log('Unable to connect to MONGODB', error)
})
/// models
const User = require('./models/User');
const FriendRequest = require('./models/FriendRequest');
const Friends = require('./models/Friends');
const BlockList = require('./models/BlockList');
const Post = require('./models/Post');
const Comments = require('./models/Comments');
const Chat = require('./models/Chat');
const { getAuth } = require('firebase/auth');
// get user data from mobile and create new user in mongoDB
app.post('/createUser',(req,res) => {
    console.log(req.body)
    new User({
        username:req.body.username,
        email:req.body.email,
        profilePicture:'',
        date:new Date().toString(),
        uid:req.body.uid
    })
    .save((err) => {
        if (err) {
            console.log(err)
            res.json({message:err.message})
        }else{
            res.json({message:'success'})
        }
    })
})


app.post('/createComment',(req,res) => {
    Post.findById(req.body.postId)
    .then((post) => {
       // console.log('POST found ', post);
        User.findOne({uid:req.body.currentUserUID})
        .then((user) => {
            new Comments({
                postId:post._id,
                userId:user._id,
                comment:req.body.comment,
                date:req.body.date
            })
            .save((err) => {
                if (err) {
                    console.log(err)
                    res.json(err)
                }
                console.log('comment saved.')
                res.json({message:'comment saved',status:'success'})
            })
        })
    })
})

app.get('/postComment/:id',(req,res) => {
    Comments.find({})
    .then((comments) => {
        let commentsArray = []
        comments.forEach((comment) => {
            if (comment.postId === req.params.id) {
                commentsArray.push(comment)
            }
        })
        res.json({commentsArray})
    })
})

app.get('/allComments',(req,res) => {
    Comments.find({})
    .then((comments) => {
        res.json({comments})
    })
    .catch((e) => {
        console.log(e);
    })
})

/// get user data from mongoDB and send it to mobile
app.get('/getUserData',(req,res) => {
    User.find({})
    .then((users) => {
        res.json(users)
    })
    .catch((e) => {
        res.json(e)
    })
})



app.post('/blockUser',(req, res)=>{
    BlockList.findOne({userId:req.body.currentUserUID})
    .then((list) => {
        if (list) {
            // update
            list.blockList.push(req.body.userId)
            list.save((err) => {
                if (err) {
                    res.json({message:'Unable to block user',reason:err.message})
                } else {
                    res.json({message:'success'})
                }
            })
        } else {
            // create new list
            new BlockList({
                userId:req.body.currentUserUID,
                date:new Date().toString()
            
            }) .save((err,blockList) => {
                if (err) {
                    console.log(err)
                    res.json(err)
                }else{
                    console.log(blockList);
                    BlockList.findById(blockList._id)
                    .then((blockedList) => {
                        blockedList.blockList.push(req.body.userId)
                        blockedList.save((err) => {
                            if (err) {
                                res.json({message:'Unable to block user',reason:err.message})
                            } else {
                                res.json({message:'success'})
                            }
                        })
                    })
                }
            })
        }
    })
})

app.get('/blockedUsers',(req,res) => {
    BlockList.find({})
    .then((blockedUsersList) => {
        res.json({blockedUsersList})
    })
    .catch((e) => res.json({message:'error',e}))
})

app.get('/deleteBlockList',(req,res) => {
    BlockList.remove()
    .then(() => res.send('Blocked Users List have been deleted'))
    .catch((e) => res.json(e))
})

// add friend post request
app.post('/addFriend',(req,res) => {
    User.findById({_id:req.body.userId})
    .then((user) => {
        User.findOne({uid:req.body.currentUserUID})
        .then((currentUser) => {
            FriendRequest.findOne({currentUserId:currentUser._id,receiverId:user._id})
            .then((frReq) => {
                if (frReq) {
                    console.log('Request already sent ...')
                } else {
                    console.log('CURRENT USER IS ---------', currentUser)
            // create new friend request
            new FriendRequest({
                receiverId:user._id,
                currentUserId:currentUser._id,
                date:new Date().toString(),
                otherUser:user,
                currentUser:currentUser
            })
            .save((err) => {
                if (err) {
                    console.log(err)
                    res.json(err)
                }else{
                    res.json({message:'friend request has been sent..'})
                }
            })
                }
            })
        }).catch(e => {
            console.log(e)
        })
    })
    .catch((err) => {
        console.log(err)
    })
})
app.get('/getAllFriendRequest',(req,res) => {
    FriendRequest.find({})
    .then((requests) => {
        res.json({requests})
    })
})

//// get current user
app.get('/getCurrentUser/:id',(req,res) => {
    User.findOne({uid:req.params.id})
    .then((user) => {
        res.json(user)
    })
    .catch((erer) => {
        console.log(erer)
    })
})
app.get('/findFriendRequest/:id',(req,res) => {
    FriendRequest.findOne({receiverId:req.params.id})
    .then((request) => {
        if (request) {
            res.json(request)
        }
    })
    .catch((err) => {
        res.json(err)
    })
})
app.get('/deleteAllFriendRequests',(req,res) => {
    FriendRequest.remove()
    .then(() => {
        res.send('All friend requests have been deleted.')
    }).catch((e) => {
        res.send(e.message)
    })
})
app.get('/deleteAllUsers',(req,res) => {
    User.remove()
    .then(() => {
        res.send('All users have been deleted')
    })
    .catch((e) => {
        res.send(e.message)
    })
})
app.get('/getAllUsers',(req,res) => {
    User.find({})
    .then((users) => {
        res.json({users})
        console.log('ALL USERS FROM MONGODB..')
    })
    .catch(e => {
        res.json(e.message)
    })
})

app.get('/declineFriend/:id',(req,res) => {
    let friendRequestId = req.params.id;
    FriendRequest.findOneAndRemove(friendRequestId,(err) => {
        if (err) {
            res.json(err.message)
        } else {
            res.json({message:'success'})
        }
    })
})
app.post('/acceptFriend',(req,res) => {
    console.log(req.body);
    new Friends({
        friendId:req.body.receiverId,
        currentUserId:req.body.currentUserId,
        date:new Date(),
        otherUser:req.body.otherUser,
        currentUser:req.body.currentUser
    })
    .save((err) => {
        if (err) {
            console.log(err);
            res.json({message:'error',error:err})
        }else{
            console.log('FRIEND REQUEST ACCEPTED SUCCESSFULLY..');
            FriendRequest.findByIdAndDelete(req.body._id,(err) => {
                if (err) {
                    res.json(err.message)
                    console.log(err);
                }else{
                    res.json({message:'success'})
                    console.log('Friend request deleted from db...');
                }
            })
        }
    })
})
// get all friends
app.get('/getAllFriends',(req,res) => {
    Friends.find({})
    .then((friendsList) => {
        res.json({friendsList})
    })
    .catch((err) => {
        res.json(err)
    })
})
app.get('/deleteAllFriends',(req,res) => {
    Friends.remove()
    .then(() => {
        res.send('ALl Friends deleted.')
    })
    .catch((err) => {
        res.send(err.message)
    })
})
app.post('/removeFriend',(req,res) => {
    
    Friends.findOne({friendId:req.body.item._id,currentUserId:req.body.currentUser._id})
    .then((friend) => {
        if (friend) {
          Friends.findOneAndRemove(friend._id,(err) => {
            if (err) {
                console.log(err);
                res.json({message:'error'})
            }
            console.log('Delete was success..');
          })  
        } else {
            Friends.findOne({friendId:req.body.currentUser._id,currentUserId:req.body.item._id})
            .then((friend) => {
                if (friend) {
                    Friends.findOneAndRemove(friend._id,(err) => {
                        if (err) {
                            console.log(err);
                            res.json({message:'error'})
                        }
                        console.log('Friend Delete was successful..');
                    })
                }
            })
            .catch(e => {
                console.log(e);
                res.json({message:'error'})
            })
        }
    })    
})
//  GET USERNAME AND SEND TO CLIENT
app.get('/getUsername/:id',(req,res) => {
    let userId = req.params.id;
    User.findById(userId)
    .then((user) => {
        res.json(user)
    })
    .catch(e => console.log(e.message))
})

app.post('/createPost',(req,res) => {
 
    User.findOne({uid:req.body.uid})
    .then((user) => {
        new Post({
            userId:user._id,
            body:req.body.body,
            image:req.body.image,
            image2:req.body.image2,
            date:req.body.date
        })
        .save((err) => {
            if (err) {
                console.log(err);
            }
            console.log('Post created successfully....')
        })
    })
})
app.post('/updatePost',(req,res) => {
  
    Post.findOneAndUpdate({uid:req.body.uid})
    
    
})

app.get('/allPosts',(req,res) => {
    Post.find({})
    .then((posts) => {
       
        res.json({posts})
    })
    .catch((e) => {
        console.log(e);
    })
})

////////// ADD LIKE TO POST
app.post('/addLike',(req,res) => {
    Post.findById(req.body.postId)
    .then((post) => {
       // console.log('POST found ', post);
        User.findOne({uid:req.body.currentUserUID})
        .then((user) => {
            //console.log('User found', user);
            post.likes.push({likedUserId:user._id,date:new Date().toString()})
            post.save((err) => {
                if (err) {
                    console.log(err);
                    res.json({message:'Error occured. Check server terminal'})
                }
                res.json({message:'liked success'})
            })
        })
    })
})
app.post('/removeLike',(req,res) => {
    Post.findById(req.body.postId)
    .then((post) => {
        User.findOne({uid:req.body.currentUserUID})
        .then((user) => {
         post.likes.forEach((like) => {
          
                if (like.likedUserId === user._id) {
                    post.likes.shift(like,1)
                post.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Like removed');
                })
                }
         })
    })
})
.catch(e => console.log(e))
})
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/firebaseConfig', (req, res)=>{
    res.json(keys.firebaseConfig);
});



app.post('/updateProfilePicture', (req, res)=>{
    console.log(req.body);
    User.findOneAndUpdate({uid:req.body.uid},{profilePicture:req.body.imageUri},(err)=>{
        if(err){
            console.log(err)
        }
        console.log('Profile Picture Updated');
        res.json({message: 'profile picture is updated'})
        })
})

app.get('/getUser/:id', (req, res) =>{
    User.find({})
    .then((users)=>{
        users.forEach((user) =>{
            if(user.uid === req.params.id){
                res.json(user)
                console.log('User Found -- ', user);
            }
        })
    }).catch(e =>{
        console.log(e)
        res.json(e)
    })
})


app.post('/createChat', (req,res) => {

    new Chat({
        currentUserId:req.body.item.currentUserId,
        otherUserId:req.body.friendId,
        message:req.body.message,
        date:new Date().toString(),
        uid:req.body.uid,
        otherUser:req.body.item.otherUser,
        currentUser:req.body.item.currentUser,
        image:req.body.image
    }).save((err) =>{
        if(err){
            console.log(err);
        }
        res.json({message:'Success'})
    })
})

app.get('/getChat', (req,res) =>{
    Chat.find({})
    .then((chats) =>{
        res.json(chats)
    })
    .catch(e => {
        console.log(e)
    })
})




app.listen(port, () => {
    console.log('Chat app listening on port port!'+port);
});

//Run app, then load http://localhost:port in a browser to see the output.

// javascript data type
// let var const
// local and global variables
// global var
//  numbers
// object

let person = {
    id:'2qwekdfjwekqndqwijbfwe',
    name:'Alex',
    age:22,
    isGraduated:true,
    hobbies:["Music","Football","Coffee",3000,false,{
        codes:[1,2,3,4,5,6]
    }]
}


//console.log(person.hobbies[5].codes[4]);

let newARray = person.hobbies[5].codes;
let reversedArray = newARray.reverse();

let imageURL = `images-${Math.random()  + '/' + Math.random()}.jpg`;
console.log('Image URL', imageURL);

let mathRandom = Math.random()
console.log('MATH RANDOM',mathRandom);

let randomGenerated = mathRandom * newARray.length;
console.log('RANDOM GENERATED --- ', randomGenerated);

let randomNumber = Math.floor(randomGenerated);
console.log('RANDOM NUMBER', randomNumber);


const random = newARray[randomNumber]

console.log('RANDOM',random);

//// random string ///
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

console.log('RANDOM STRING -- ',makeid(10));

////////////
let r = (Math.random() + 1).toString(36).substring(7);
console.log("random R", r);