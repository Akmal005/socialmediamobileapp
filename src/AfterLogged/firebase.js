import '../firebase/config';
import { getAuth, signOut } from 'firebase/auth';
import { onValue, ref, getDatabase, push, set, remove } from 'firebase/database';
import { Alert } from 'react-native';
// get all posts

// get username
export function getUsername(id){
    let username = ''
    fetch(`http://localhost:3000/getUsername/${id}`,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'GET'
    })
    .then(res => res.json())
    .then((user) => {
        console.log('user obj ', user.username);
        username = user.username
    })
    .catch(e => {
        console.log(e.message)
    })
    return username;
  }
// get user object
export const getUserData = function(id){
    let userData;
    onValue(ref(getDatabase(),`users/${id}`),(user) => {
        userData = user
    })
    return userData;
}
// logout func
export const logOut = () => {
    signOut(getAuth())
}
export function createComment(postId,currentUserUID,comment,date){
    fetch(`http://localhost:3000/createComment`,{
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
     method:'POST',
     body:JSON.stringify({
        postId,
        currentUserUID,
        comment, 
        date
     })
    })
    .then((response) => {
     console.log(response);
    }).catch(e => console.log(e))
 }

export function getNumberOfComments(id){
    let number = 0;
    onValue(ref(getDatabase(),`post-comments`),(postComments) => {
        postComments.forEach((comment) => {
            if (comment.val().postId === id) {
                number++
            }
        })
    })
    return number
}

export function addLike(postId,currentUserUID){
   fetch(`http://localhost:3000/addLike`,{
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    method:'POST',
    body:JSON.stringify({
        postId,
        currentUserUID
    })
   })
   .then((response) => {
    console.log(response);
   }).catch(e => console.log(e))
}

export function isPostLiked(id){
    let isPostLikedByUser = false;
    onValue(ref(getDatabase(),`likes/${id}`),(likedPost) => {
       likedPost.forEach((like) => {
        if (like.val().userId === getAuth().currentUser.uid) {
            isPostLikedByUser = true
        }else{
            isPostLikedByUser = false
        }
       })
    })
    return isPostLikedByUser
}

export function removeLike(postId,currentUserUID){
   fetch('http://localhost:3000/removeLike',{
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    method:'POST',
    body:JSON.stringify({
        postId,
        currentUserUID
    })
   })
   .then((res) => {
    console.log(res);
   })
   .catch((e) => {
    console.log(e);
   })
}

export function getNumberOfLikes(id){
    let number = 0;
    onValue(ref(getDatabase(),`likes/${id}`),(likes) => {
        likes.forEach((like) => {
            if (like.val().postId === id) {
                number++
            }
        })
    })
    return number
}
export function getAllLikes(id){
    let allLikes;
    onValue(ref(getDatabase(),`likes/${id}`),(likes) => {
        let likesArray = []
        likes.forEach((like) => {
            likesArray.push(like)
        })
        allLikes = likesArray;
    })
    return allLikes;
}

export function isUserBlocked(id){
   // console.log('id',id)
    let blocked = false;
    onValue(ref(getDatabase(),`blockedUsers`),(blockedUsers) => {
       blockedUsers.forEach((blockedUser) => {
           console.log('BLOCKED USER IS --- ',blockedUser)
           if (blockedUser.val().userId === id) {
               blocked = true
           }
       })
    })
    return blocked;
}

export function addFriend(id){
    console.log('NEW FRIEND ID IS ', id)
//     push(ref(getDatabase(),`friendrequest`),{
//         receiver:item.key, 
//         sender:getAuth().currentUser.uid,
// })
    fetch('http://localhost:3000/addFriend',
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'POST',
        body:JSON.stringify({
            userId:id,
            currentUserUID:getAuth().currentUser.uid
        })
    })
    .then((res) => {
        console.log(res)
    })
    .catch(e => {
        console.log(e.message)
    })
}

export function AcceptFriend(user){
    fetch(`http://localhost:3000/acceptFriend`,
    {headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method:'POST',
      body:JSON.stringify(user)
    })
    .then((res) => console.log(res))
    .catch((err) => {
        console.log(err.message)
    })
}
export function DeclineFriend(user){
    fetch(`http://localhost:3000/declineFriend/${user.key}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        if (data.message === 'success') {
            console.log('FRIEND REQUEST HAS BEEN DELETED SUCCESSFULLYY .....')
        } else {
            console.log('Something went wrong,,,.....', data)
        }
    })
    .catch(e => console.log(e))
}

// CHAT ROOM MESSAGES
export function createChat(userId,message,date,image){
    let currentUserId = getAuth().currentUser.uid;
    // receiver message
    push(ref(getDatabase(),`chats/${userId}/${currentUserId}`),{
        receiverId:userId,
        receiverMessage:message,
        senderId:currentUserId,
        senderMessage:null,
        receiverImage:image,
        senderImage:null,
        date:date,
    })
    // sender message
    push(ref(getDatabase(),`chats/${currentUserId}/${userId}`),{
        receiverId:userId,
        receiverMessage:null,
        senderId:currentUserId,
        senderMessage:message,
        receiverImage:null,
        senderImage:image,
        date:date,
    })
}
// find out if user is a friend
export function isFriend(id){
let isFriend = false;
onValue(ref(getDatabase(),`friendslist/${getAuth().currentUser.uid}`),(friends) => {
    friends.forEach((friend) => {
        if (friend.val().friend === id) {
            isFriend = true
        }else{
            isFriend = false
        }
    })
})
return isFriend
}
export function removeFriend(item,currentUser){
    fetch(`http://localhost:3000/removeFriend`,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'POST',
        body:JSON.stringify({item,currentUser})
    })
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log('REMOVE FRIEND ---- ')
        console.log(err.message);
    })
}

export function blockUser(id){
    console.log('Blocker User ID IS ', id)
        fetch('http://localhost:3000/blockUser',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method:'POST',
            body:JSON.stringify({
                userId:id,
                currentUserUID:getAuth().currentUser.uid
            })
        })
        .then((res) => {
            console.log(res)
        })
        .catch(e => {
            console.log(e.message)
        })
}


export function unBlockUser(id){
    remove(ref(getDatabase(),`blockedUsers`),{
        userId:id
    })
}


export function createPost(uid,body,image,image2,date){
    fetch('http://localhost:3000/createPost',
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'POST',
        body:JSON.stringify({
            uid,
            body,
            image,
            image2,
            date,
        })
    })
    .then((res) => {
        console.log(res)
    })
    .catch(e => {
        console.log(e.message)
    })
}
