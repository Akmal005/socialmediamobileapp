import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, style, StyleSheet, FlatList } from 'react-native'
import React, {useState, useEffect}from 'react';
import bot from '../../assets/users.png';
import { onValue, ref, getDatabase, push } from 'firebase/database';
import { getAuth,} from 'firebase/auth';



export default function ChatRoom({navigation, route}) {

  const [loading, setLoading] = useState(true);
  const [user,setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [friends,setFriends] = useState([]);

  useEffect(()=>{
    //////////// fetch all friends///////////
   fetch(`http://localhost:3000/getAllFriends`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method:'GET'
   })
   .then(res => res.json())
   .then(friends => {
    let friendsArray = []
   friends.friendsList.forEach(friend => {
    friendsArray.push(friend)
   })
   setFriends(friendsArray)
   })
   ////////////fetch all users ///////
   fetch(`http://localhost:3000/getUserData`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method:'GET'
   })
   .then(res => res.json())
   .then((users) => {
    setUsers(users)
   })
   .catch(e => {
    console.log(e)
   })
   ///////////fetch current user////////////
   fetch(`http://localhost:3000/getCurrentUser/${getAuth().currentUser.uid}`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method:'GET'
  })
  .then(res => res.json())
  .then((user) => {
    setUser(user)
  })
  .catch(e => console.log(e))
  },[])

  function getUsername(a,b){
    let username = ''
    let friendId = a === user._id ? b : a
    users.forEach((user) => {
      if (user._id === friendId) {
        username = user.username
      }
    })
    return username
  }
  function getUserImage(a,b){
    let image = ''
    let friendId = a === user._id ? b : a
    users.forEach((user) => {
      if (user._id === friendId) {
        image = user.profilePicture
      }
    })
    return image
  }

  console.log('USERS STATE --- ',users);
  console.log('FRIENDS LIST STATE --- ', friends);

  return (
    <SafeAreaView style={styles.container}>
       <FlatList
       data={friends}
       renderItem={({item,index}) => {
        if (item.friendId === user?._id || item.currentUserId === user?._id) {
          return(
            <View  
            key={index}
            style={styles.usercontainer}>
        
        <View style={styles.userbox}>
            <View style={styles.profilepic}>
                <Image source ={getUserImage(item.currentUserId,item.friendId) ? { uri: getUserImage(item.currentUserId,item.friendId) } : require('../../assets/user.png')} style={styles.image}></Image>
            </View>
            <TouchableOpacity 
            onPress={() => navigation.navigate('Chat',{
              item,
              username:getUsername(item.currentUserId,item.friendId),
              profilePicture:getUserImage(item.currentUserId,item.friendId)
            })}
            style={styles.usernameclick}>
            <Text 
            style={styles.username}>
              {getUsername(item.currentUserId,item.friendId)}
            </Text>
            </TouchableOpacity>
            
        </View>
        </View>
          )
        }
       }}
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
      flex: 1
  },
  usercontainer:{
      paddingBottom: 1,
      flexDirection: 'row',
  },
  userbox:{
      height: 70,
      width: '100%',
      backgroundColor: '#ffff',
      flexDirection: 'row'
  },
  follow:{
      position: 'absolute',
      marginLeft: 310,
      marginTop: 15,
      backgroundColor: '#94C0E5',
      height: 30,
      width: 70,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center'
  },
  usertext:{
      position:'absolute',
      marginLeft: 80,
      marginTop: 25,
      height: 45,
      width: 220,

  },
  profilepic:{
      marginTop: 10,
      width: 50,
      height: 50,
      marginLeft: 10,
      borderRadius: 10,
  },

  image:{
      height: 50,
      width: 50,
  },
  username:{
    marginLeft: 20,
    marginTop: 30,
    color:'#000000'
  },
  usernameclick:{
    width: '100%'
  }
  
})