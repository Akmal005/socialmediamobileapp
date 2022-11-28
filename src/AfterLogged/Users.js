import { View, Text, ScrollView, FlatList, Image, SafeAreaView, StyleSheet, 
  TouchableOpacity, Dimensions, TouchableHighlight, Alert } from 'react-native'
import React,{useEffect, useState} from 'react'
import { onValue, ref, getDatabase } from 'firebase/database';
import userlogo from '../../assets/user.png';
import bot from '../../assets/users.png';
import { SearchBar } from 'react-native-screens';
import { addFriend, removeFriend, isUserBlocked } from './firebase';
import {getAuth} from 'firebase/auth';


// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 200;
const RECIPE_ITEM_MARGIN = 5;


export default function Users({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [currentUser,setCurrentUser] = useState(null);

  const [friendRequests, setFriendRequests] = useState([]);

  const [friends,setFriends] = useState([])


  function isFriendRequestSent(id){
   // console.log(id)
    let isFriend = false;
    friendRequests.forEach((request) => {
     if (currentUser) {
      if (request.receiverId === id && request.currentUserId === currentUser._id) {
        isFriend = true
      }
     }else{
      getCurrentUser()
     }
    })
    return isFriend
  }

  function getAllUsers(){
    fetch('http://localhost:3000/getUserData',{method:'GET'})
    .then((res) => res.json())
    .then((data) => {
        let friendsgroup = []
        data.forEach((user) => {
          friendsgroup.push(user)
        })
        setUsers(friendsgroup)
    })
    .catch((err) => {
      Alert.alert(err.message)
    })
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
            //console.log(requests)
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

  function getCurrentUser(){
    let auth = getAuth()
    fetch(`http://localhost:3000/getCurrentUser/${auth.currentUser.uid}`,{
      method:'GET'
    })
    .then(res => res.json())
    .then((user) => {
      setCurrentUser(user)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  function isFriend(id){
    let isAlreadyFriend = false;
    friends.forEach((friend) => {
      if (currentUser) {
        if (currentUser._id !== null && friend.currentUserId === id && friend.friendId === currentUser._id || friend.friendId === id && friend.currentUserId === currentUser._id) {
          isAlreadyFriend = true
        }
      }
    })
    return isAlreadyFriend
  }

 
useEffect(()=>{
  getCurrentUser()
  findOutIfRequestSent()
  getAllFriends()
},[])

useEffect(() => {
if (loading) {
  getAllUsers()
  setLoading(false)
}
},[loading])

  const renderUsers = ({item}) =>{
      return (
          <View style={styles.container}>
      <View>
      <TouchableOpacity onPress={() => navigation.navigate('UserProfile',{
            id:item._id
          })}  
         >
        <Image style={styles.photo} source={item.profilePicture ? {uri:item.profilePicture} : require('../../assets/user.png')} alt="Image" />
          <Text style={{marginLeft: 65, marginTop: 15, fontSize: 17}}>{item.username}</Text>   
      </TouchableOpacity>
      {isFriend(item._id) ?  <TouchableOpacity onPress={() => removeFriend(item,currentUser)} 
         style={{height: 40, width: 140, backgroundColor: 'blue', marginTop: 20, marginLeft: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
          <Text style={{color:'#fff'}}>Remove Friend</Text>
      </TouchableOpacity> :  <TouchableOpacity
      onPress={() => {
        addFriend(item._id)
      }} 
         style={{height: 40, width: 140, backgroundColor: isFriendRequestSent(item._id) ? 'green':'grey', marginTop: 20, marginLeft: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
          <Text style={{
            color:'#fff'
          }}>
            {isFriendRequestSent(item._id) ? 'Request sent':'Add Friend'}
          </Text>
      </TouchableOpacity>}
     
      </View>
    </View>
      )
  }
return (

    <SafeAreaView style={{
      flex:1
    }}>
      <FlatList 
          vertical
          numColumns={2} 
          data={users}
          renderItem={renderUsers}
      />
    </SafeAreaView>
    
);
}

const styles = StyleSheet.create({
  container: {
      marginHorizontal: 3,
      marginTop: 5,
      width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
      height: RECIPE_ITEM_HEIGHT + 85,
      borderColor: '#cccccc',
      borderWidth: 0.5,
      borderRadius: 15,
      
      
    },
    photo: {
      width: 160,
      height: 160,
      borderRadius: 15,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0, 
      marginLeft: 10,
    },
    title: {
      flex: 1,
      fontSize: 14,
      fontWeight: 'bold',
      color: '#444444',
      justifyContent: 'center',


    },
    
})