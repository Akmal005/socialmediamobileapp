import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { onValue, ref, getDatabase } from 'firebase/database';
import { ScrollView } from 'react-native-gesture-handler';
import { AcceptFriend, DeclineFriend } from '../AfterLogged/firebase';
import { getAuth,} from 'firebase/auth';
import userpic from '../../assets/user.png'
import { LinearGradient } from 'expo-linear-gradient';

import { isUserBlocked } from './firebase';

export default function Notification() {
  
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [isBlocked,setIsBlocked] = useState(false);
  const [friendRequests,setFriendRequests] = useState([])

  function getAllFriendRequests(){
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
      let requestsArray = []
      requests.requests.forEach((request) => {
        requestsArray.push(request)
      })
      setFriendRequests(requestsArray)
})
.catch(e => {
  console.log(e.message)
})
}

function getAllUsers(){
  fetch(`http://localhost:3000/getAllUsers`,
{
  method:'GET',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
})
.then(res => res.json())
.then((allUsers) => {
      let usersArray = []
      allUsers.users.forEach((user) => {
        usersArray.push(user)
      })
      setUsers(usersArray)
})
.catch(e => {
  console.log(e.message)
})
}

  useEffect(()=>{
      if(loading){
          getAllUsers()
          setLoading(false)
      }
  },[loading])

  useEffect(() => {
    getAllFriendRequests()
  },[friendRequests])


  function getUsername(id){
    let username;
    users.forEach((user) => {
      if (user._id === id) {
        
        username = user.username
      }
    })
    return username
  }

  

  return (
    <ScrollView>
      {friendRequests && friendRequests.map((user, index) => (
        <>
        <LinearGradient key={index} colors={['#4c669f', '#3b5998', '#192f6a']} style={{width: 380, height: 60, backgroundColor: '#7D77FF',  flexDirection: 'row', marginTop: 2, borderRadius: 10, marginLeft: 5}}>
          <View style={{height:50, width: 50, borderRadius: 40, backgroundColor: 'white', marginTop: 5, marginLeft: 5, justifyContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
          <Image source={userpic} style={{height: 40, width: 40}} ></Image>
          </View>
          <View style={{height: 30, width: 150,  marginTop: 15, marginLeft: 15, justifyContent: 'center', }}>
          <Text style={{fontSize: 18, color:'#fff'}}>{getUsername(user.currentUserId)}</Text>
          </View>
          <TouchableOpacity  onPress={() => DeclineFriend(user)} style={{height: 30, width: 60, backgroundColor: 'white', marginLeft: 30, marginTop: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}} >
          <Text style={{fontSize: 13}}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity   onPress={() => AcceptFriend(user)}  style={{height: 30, width: 60, backgroundColor: 'white', marginLeft: 5, marginTop: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}} >
          <Text style={{fontSize: 13}}>Accept</Text>
          </TouchableOpacity>
          </LinearGradient>
        </>
      )) }
    </ScrollView>
  )
}