import { View, Text, SafeAreaView, ScrollView, style, StyleSheet, 
  Image, TouchableOpacity, Dimensions, LogBox, Alert } from 'react-native'
import React,{useState, useEffect, useContext} from 'react'
import { useNavigation, NavigationAction, navigate, navigation } from '@react-navigation/native';
import image from '../../assets/user.png';
import bot from '../../assets/users.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import PostImage from '../../assets/scene.jpeg';
import { SliderBox } from "react-native-image-slider-box";
import { AntDesign } from '@expo/vector-icons';
import sent from '../../assets/sent.png';
import bell from '../../assets/bell.png';

import {  addLike, removeLike } from './firebase';
import { onValue, getDatabase, ref } from 'firebase/database';
import { getAuth, signOut} from 'firebase/auth';

import { FirebaseContext } from '../firebase/firebase';



export default function HomePageScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [displayPhotos,setDisplayPhotos] = useState(false);
    const [selectedPost,setSelectedPost] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentUser,setCurrentUser] = useState(null);
    const [friends,setFriends] = useState([])
    const [allComments,setAllComments] = useState([])
    const [friendRequests,setFriendRequests] = useState([])
    const firebaseContext = useContext(FirebaseContext);
    console.log(firebaseContext)

    let currentUserUID = getAuth().currentUser.uid;

    function getLoggedUser(){
      fetch(`http://localhost:3000/getCurrentUser/${currentUserUID}`)
      .then(res => res.json())
      .then((user) => {
        setCurrentUser(user)
      })
      .catch(e => {
        console.log(e);
      })
    }

    const getPosts = function(){
      fetch('http://localhost:3000/allPosts')
      .then(res => res.json())
      .then((posts) => {
        
        let postsArray = []
        posts.posts.forEach((post) => {
          postsArray.push(post)
        })
        setPosts(postsArray.reverse())
      })
      .catch(e => console.log(e))
  }

  const getAllComments = function(){
    fetch('http://localhost:3000/allComments')
    .then(res => res.json())
    .then((comments) => {
      
      setAllComments(comments.comments)
    })
    .catch(e => console.log(e))
}

function getNumberOfComments(id){
  let number = 0
  allComments.forEach((comment) => {
    if (comment.postId === id) {
      number++
    }
  })
  return number
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

  function getUsername(id){
    let username = ''
    users.forEach((user) => {
      if (user._id === id) {
        username = user.username;
      }
    })
    return username
  }

  function getProfilePicture(postID){
    let image = ''
    users.forEach((user)=>{
      if(user._id === postID){
        image = user.profilePicture
      }
    })
    return image
  }

  function isPostLiked(postId){
    let liked = false
    posts.forEach((post) => {
      if (post._id === postId) {
        post.likes.forEach((like) => {
          if (currentUser && like.likedUserId === currentUser._id) {
            liked = true
          }
        })
      }
    })
    return liked
  }
  
  function  getNumberOfNotifications(){
    let number = 0
    friendRequests.forEach((request)=>{
      number++
    })
    return number
  }

  function getNumberOfLikes(postId){
    let i = 0
    posts.forEach((post) => {
      if (post._id === postId) {
        post.likes.forEach((like) => {
          i++
        })
      }
    })
    return i
  }
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
  useEffect(()=>{
    fetch('http://localhost:3000/getAllFriends',
    {method:'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },})
    .then((res) => res.json())
    .then((data) => {
      console.log('DATA----------------', data)
      let friendsArray = []
      data.friendsList.forEach((friend) => {
        if (friend) {
          if (currentUser._id !== null && friend.friendId === currentUser._id && friend.otherUser.uid === currentUserUID  || friend.friendId === currentUser._id && friend.currentUser.uid === currentUserUID) {
  
            friendsArray.push(friend)
          }
        }
      })
      setFriends(friendsArray)
      console.log('Friends -----------------', friends)
    })
  },[])

   
    console.log(image)
    useEffect(()=>{
      LogBox.ignoreAllLogs()
      getPosts()
      getAllUsers()
      getLoggedUser()
      getAllComments()
      getAllFriendRequests()
    },[])

    return (
      <>
      {!displayPhotos ? <SafeAreaView style={styles.container}>
        <View style={{height: 60, width: '100%', flexDirection: 'row'}}>
          <Text style={{fontSize: 30, marginTop: 15, marginLeft: 15}}>Posts</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('Notification')} style={{ marginLeft: 230, marginTop: 20, flexDirection: 'row'}}>
            <Image source={bell} style={{height: 25, width: 25,}}></Image>
            <Text style={{fontSize: 23, marginLeft: 5, color: 'red'}}>{getNumberOfNotifications()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            signOut(getAuth())
            //navigation.navigate('Chat Room')
            }} style={{marginLeft: 10, marginTop: 20}}>
            <Image source={sent} style={{height: 25, width: 25,}}></Image>
          </TouchableOpacity>
          
        </View>
          
        <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}>

                 {friends && friends.map((user, index)=>{
                  return (
             <TouchableOpacity onPress={()=> navigation.navigate('User Profile',{
                      user
                    })}  style={styles.usercircle} key={index}>
                      
                      
                      <Image source={user.friendId !==users._id ? {uri:user.currentUser.profilePicture} : {uri:user.otherUser.profilePicture}} style={{
                        width:40,
                        height: 40
                      }}></Image>
                 
            
            
             </TouchableOpacity>
                  )
                 })}
            </ScrollView>
          
          <ScrollView>
            {posts && posts.map((post, index)=>{
              return (
                <View style={styles.postWrapper} key={index}>
                  <View style={styles.profileview}>
                    <Image source={getProfilePicture(post._id)} style={styles.postprofile}></Image>
                    <TouchableOpacity onPress={()=> navigation.navigate('UserProfile',{
                      id:post.userId
                    })} style={styles.usernamewrapper}  >
                      <Text style={styles.usernametext}>{getUsername(post.userId)}</Text>
                      </TouchableOpacity>
                  </View>
  
                  
  
                  <View>
  
                    {!post.image2 ?  <SliderBox
                      images={[post.image]}
                      sliderBoxHeight={335}
                      onCurrentImagePressed={index => {
                        setSelectedPost(post)
                        setDisplayPhotos(false)
                        Alert.alert(`Image index is ${index}`)
                      }}
                      dotColor="#FFEE58"
                      inactiveDotColor="#90A4AE"
                     /> :  <SliderBox
                     images={[post.image,post.image2]}
                     sliderBoxHeight={335}
                     onCurrentImagePressed={index => {
                       setSelectedPost(post)
                       setDisplayPhotos(false)
                       Alert.alert(`Image index is ${index}`)
                     }}
                     dotColor="#FFEE58"
                     inactiveDotColor="#90A4AE"
                    />}
               
                  </View>
                  <View style={styles.captionWrapper}>
                  <Text style={styles.captionText}>{post.body}</Text>
                  </View>
  
                  <View style={styles.posttab}>
                      {isPostLiked(post._id) ? <AntDesign onPress={() => {
                        removeLike(post._id,currentUserUID)
                        getPosts()
                      }} name="heart" size={24} color="red" style={{marginLeft: 10, marginTop: 10}} /> : <AntDesign onPress={() =>{ 
                        addLike(post._id,currentUserUID)
                        getPosts()
                        }} name="hearto" size={24} color="black" style={{marginLeft: 10, marginTop: 10}} />}
                    <Text 
                    onPress={() => navigation.navigate('LikeUsers',{post})}
                    style={{
                      marginLeft: 13,
                      marginTop: 15,
                      fontSize: 20
                    }}>
                      {getNumberOfLikes(post._id)}
                    </Text>
                    <TouchableOpacity 
                    onPress={()=>navigation.navigate('Comments', {post})} 
                    style={styles.commentWrapper}>
                      <Image source={comment} style={{
                        height: 25,
                        width: 25,
                        marginLeft: 5
                      }}></Image>
                    </TouchableOpacity>
                    <Text style={{
                      marginLeft: 13,
                      marginTop: 15,
                      fontSize: 20
                    }}>
                      {getNumberOfComments(post._id)}
                    </Text>
                    
                    
                  </View>
            </View>
              )
            })}
            <View style={{height:200}}></View>
          </ScrollView>
        </SafeAreaView>
        : 
        <View style={styles.showImages}>
          <View style={{flex:1, justifyContent:'center',width:Dimensions.get('screen').width}}>
          <AntDesign onPress={() => {
               setDisplayPhotos(false)
               navigation.setOptions({headerShown:false})
          }} style={{alignItems:'flex-start',alignContent:'flex-start',marginBottom:50,marginLeft:5}} name="closecircleo" size={24} color="black" />
          </View>

          <View style={{flex:1}}>
          <SliderBox
            images={[selectedPost.image,selectedPost.image2]}
            sliderBoxHeight={335}
            dotColor="#FFEE58"
            inactiveDotColor="#90A4AE"
            onCurrentImagePressed={() => {
              setDisplayPhotos(false)
              navigation.setOptions({headerShown:true})
            }}
            />
            <View>

            </View>
          </View>

          <View style={{flex:1}}>

          </View>
        </View>
        }
      </>
    );
  }

  const styles = StyleSheet.create({
    container:{
      backgroundColor: '#ffffff'
    },
    storyview:{
      backgroundColor: '#fffff',
      height: 100,
      width: '100%',
    },
    usercircle:{
      backgroundColor: '#fff',
      height: 60,
      width: 60,
      marginTop: 7,
      marginBottom: 5,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.2,
      borderColor:'#ffff'
    },
    postWrapper:{
      height: 520,
      width: 380,
      marginTop: 10,
      borderTopWidth: 0.3,
      borderTopColor: '#eaeaea',
    },
    profileview:{
      flexDirection: 'row',
      backgroundColor: '#fff',
      height: 55,
      width: '100%',
      backgroundColor: '#ffffff'
    },
    postprofile:{
      backgroundColor: '#ffff',
      height: 35,
      width: 35,
      marginTop: 10,
      marginLeft: 10,
      
      justifyContent: 'center',
      alignContent: 'center',
    },
    usernametext:{
      marginLeft: 20,
      marginTop: 15,
      fontSize: 20
      
    },
    usernamewrapper:{
      height: 65,
      width: 335
    },
    posttab:{
      marginTop: 5,
      height: 55,
      width: 380,
      backgroundColor: '#ffffff',
      flexDirection: 'row',
      borderRadius: 8
    },
    likeWrapper:{
      justifyContent: 'center',
      alignContent: 'center',
      width: 25,
      height: 25,
      marginTop: 10,
      marginLeft: 10

    },
    commentWrapper:{
      justifyContent: 'center',
      alignContent: 'center',
      width: 40,
      height: 45,
      marginLeft: 50,
      
    },
    captionWrapper:{
      height: 70,
      width: '100%',
      marginTop: 5,
      backgroundColor: '#ffffff',
      padding: 5
    },
    captionText:{
      fontSize: 15,
      paddingLeft: 5,
    },
    showImages:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      alignContent:'center',
      backgroundColor: '#ffffff',
      marginRight: 5,
      position: 'absolute',
      width: 380
      

    }
  })