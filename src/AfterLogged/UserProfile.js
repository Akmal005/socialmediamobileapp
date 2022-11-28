import { View, Text, StyleSheet,TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import React , {useState, useEffect} from 'react';
import { getUserData, addFriend, blockUser, isUserBlocked, unBlockUser } from './firebase';
import { getAuth } from 'firebase/auth';

export default function UserProfile({navigation, route}) {
    const [loading, setLoading] = useState(true);
    const { id } = route.params;

    const [user1,setUser1] = useState({username:''});

    const [friendRequests, setFriendRequests] = useState([]);

    const [currentUser,setCurrentUser] = useState({_id:''});

    const [friends,setFriends] = useState([])

    const [blockedUsers,setBlockedUsers] = useState([])

    function isFriendRequestSent(id){
       // console.log(id)
        let isFriend = false;
        friendRequests.forEach((request) => {
          //console.log('for each method request -- ',request)
          if (request.receiverId === id && request.currentUserId === currentUser._id) {
            isFriend = true
          }
        })
        return isFriend
      }
      function getAllFriends(){
        fetch('http://localhost:3000/getAllFriends',{method:'GET'})
        .then((res) => res.json())
        .then((data) => {
          let friendsArray = []
          data.friendsList.forEach((friend) => {
            friendsArray.push(friend)
          })
          setFriends(friendsArray)
        })
      }

      function getCurrentUser(){
        fetch(`http://localhost:3000/getCurrentUser/${getAuth().currentUser.uid}`,{
          method:'GET'
        })
        .then(res => res.json())
        .then((user) => {
         // console.log('CURRENT USER IS ----',user)
          setCurrentUser({_id:user._id})
        })
        .catch((err) => {
          console.log(err)
        })
      }

      function findOutIfRequestSent(){
        fetch(`http://localhost:3000/getAllFriendRequest`,
    {
      method:'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
  })
    .then(res => res.json())
    .then((requests) => {
         // console.log(requests)
          let requestsArray = []
          requests.requests.forEach((request) => {
            //console.log('EACH REQUEST ---- ', request)
            requestsArray.push(request)
          })
          setFriendRequests(requestsArray)
    })
    .catch(e => {
      console.log(e.message)
  })
}

function isFriend(id){
    let isAlreadyFriend = false;
    friends.forEach((friend) => {
      if (friend.currentUserId === id && friend.friendId === currentUser._id || friend.friendId === id && friend.currentUserId === currentUser._id ) {
        isAlreadyFriend = true
      }
    })
    return isAlreadyFriend
  }

  function getBlockList(){
    fetch(`http://localhost:3000/blockedUsers`,{
      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((res) => res.json())
    .then((list) => {
      console.log('LIST ------------------------------------------------- ',list)
      let blockedUsersList = []
      list.blockedUsersList.forEach((blockedUsers) => {
       console.log(typeof blockedUsers);
        console.log('BLOCKED USERS ----- ',blockedUsers)
        if (blockedUsers.userId === getAuth().currentUser.uid) {
          blockedUsers.blockList.forEach((id) => {
            blockedUsersList.push(id)
          })
        }
      })
      setBlockedUsers(blockedUsersList)
    })
    .catch((e) => console.log(e.message))
  }

  function userBlockedOrNot(userId){
    let blocked = false
    blockedUsers.forEach((id) => {
      if (id === userId) {
        blocked = true
      }
    })
    return blocked
  }

  console.log('BLOCKED USERS FROM  STATE --------------- ',blockedUsers)

    useEffect(() => {
        if (loading) {
            fetch('http://localhost:3000/getAllUsers')
            .then((res) => res.json())
            .then((users) => {
                users.users.forEach((user) => {
                    if (user._id === id) {
                        setUser1({username:user.username})
                    }
                })
            })
            setLoading(false)
        }
    },[loading])
    

    useEffect(() => {
        getCurrentUser()
        findOutIfRequestSent()
        getAllFriends()
        getBlockList()
    },[])
    
  
    return (
    <SafeAreaView>
       <View style={{
            height: 120, width: 120,backgroundColor: 'grey',marginTop: 5,marginLeft: 10,borderRadius: 40}}>

           <View style={{height: 40, width: 140,marginLeft: 130, justifyContent: 'center',}}>
                <Text style={{fontSize: 22}}> {user1.username && user1.username} </Text>
           </View>
           <View style={{height: 40, width: 140,marginLeft: 85, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{fontSize: 16}}> Bio: </Text>
           </View>
        </View>
      
      
      
      
      
      
      
      <View style={{width: '100%', height: 50, flexDirection: 'row'}}>
      {isFriend(id) ? <TouchableOpacity style={{width: 150, marginTop: 20, height: 30, backgroundColor: 'grey', marginLeft: 25, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 16, color: 'white'}}>Remove Friend</Text>
    </TouchableOpacity> : <TouchableOpacity  
    onPress={() => addFriend(id)}
    style={{width: 150, marginTop: 20, height: 30, backgroundColor: 'grey', marginLeft: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 16}}>
        {isFriendRequestSent(id) ? 'Request sent':'Add Friend'}
        </Text>
    </TouchableOpacity>}

        {userBlockedOrNot(id) ? <TouchableOpacity onPress={() => unBlockUser(id)}   style={{width: 150, marginTop: 20, height: 30, backgroundColor: 'grey', marginLeft: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 16}}>
            Unblock Friend
        </Text>
    </TouchableOpacity> : <TouchableOpacity onPress={() => blockUser(id)}   style={{width: 150, marginTop: 20, height: 30, backgroundColor: 'red', marginLeft: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 16, color: 'white'}}>
            Block Friend
        </Text>
    </TouchableOpacity>}
     
     
     
     
     
     
     
     </View>
        <View style={{height: 70, width: '100%',marginTop: 30}}>
            <View style={{height: 35, width: '100%', flexDirection: 'row', marginTop: 5}}>
                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', width: 123, marginLeft: 5}} >
              <Text style={{fontSize: 18, marginBottom: 5}} >Posts</Text>
                </View>
                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', width: 123, marginLeft: 5}} >
              <Text style={{fontSize: 18, marginBottom: 5}} >Friends</Text>
                </View>
                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', width: 123, marginLeft: 5}} >
              <Text style={{fontSize: 18, marginBottom: 5}} >Likes</Text>
                </View>
            </View>
            <View style={{height: 35, width: '100%', flexDirection: 'row'}}>
                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', width: 123, marginLeft: 5}} >
              <Text style={{fontSize: 18, marginBottom: 5}} >0</Text>
                </View>
                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', width: 123, marginLeft: 5}} >
              <Text style={{fontSize: 18, marginBottom: 5}} >0</Text>
                </View>
                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', width: 123, marginLeft: 5}} >
              <Text style={{fontSize: 18, marginBottom: 5}} >0</Text>
                </View>
            </View>
            
            <View style={{height: 40, width: '100%', flexDirection: 'row', marginTop: 20, }}>
            <TouchableOpacity style={{height: 30, justifyContent: 'center',   alignItems: 'center', width: 123, marginLeft: 5, borderRadius: 15, backgroundColor: 'grey'}} >
              <Text style={{fontSize: 17, marginBottom: 5}} >Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{height: 30, justifyContent: 'center', alignItems: 'center', width: 123, marginLeft: 5,  borderRadius: 15, backgroundColor: 'grey'}} >
              <Text style={{fontSize: 17, marginBottom: 5}} >Texts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{height: 30, justifyContent: 'center',  alignItems: 'center', width: 123, marginLeft: 5,  borderRadius: 15, backgroundColor: 'grey'}} >
              <Text style={{fontSize: 17, marginBottom: 5}} >Collection</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}
