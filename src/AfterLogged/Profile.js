import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Alert, Button, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, NavigationAction, navigate, navigation } from '@react-navigation/native';
import HomePageScreen from './Home';
import edit from '../hidden/Edit';
import bot from '../../assets/user.png';
import CAR from '../../assets/CAR.jpeg';
import tree from '../../assets/tree.jpg';
import settings from '../../assets/settings.png'
import logout from '../../assets/logout.png'
import { SliderBox } from "react-native-image-slider-box";
import { logOut, getUserData } from './firebase';
import { getAuth, } from 'firebase/auth';
import { onValue, getDatabase, ref } from 'firebase/database';
import { ScrollView } from 'react-native-gesture-handler';
import UserDefaultImage from '../../assets/user.png';
import * as ImagePicker from 'expo-image-picker';

import Amplify, {Storage} from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

function Profile({ navigation, route }) {
    let auth = getAuth()

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    _id:null,
    username:null,
    email:null,
    profilePicture:null,
    date:null,
    uid:null
  });

  const [image, setImage] = useState(null);

  const [progressText, setProgressText] = useState('');
 const [isLoading, setisLoading] = useState(false);
 const [ Posts, setPosts ] = useState([])
 const [ ownPosts, setownPosts ] = useState([null])


  useEffect(()=>{
    fetch(`http://localhost:3000/getCurrentUser/${auth.currentUser.uid}`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method:'GET'
    })
    .then((res) => res.json())
    .then((user) => {
      
      setUser({
        _id:user._id,
        username:user.username,
        email:user.email,
        profilePicture:user.profilePicture,
        date:user.date,
        uid:user.uid
      })
    })
    .catch(e => {
      console.log(e);
    })
  },[user])

  useEffect(()=>{
    fetch('http://localhost:3000/allPosts')
    .then(res => res.json())
    .then((posts) => {
      let postsArray = []
      posts.posts.forEach((post) => {
        
        if (post.userId === user._id){
          postsArray.push(post)
        }
      })
      setPosts(postsArray)
    })
    .catch(e => console.log(e))
  },[user, Posts])

  
  

    // image upload
    async function uploadImage(){
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);

      uploadResource(result)
  
      if (!result.cancelled) {
        console.log('image upload started');
      }

    }
/////////////////aws s3 img upload ///
const fetchResourceFromURI = async uri => {
  const response = await fetch(uri);
  console.log(response);
  const blob = await response.blob();
  return blob;
};

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

const uploadResource = async (asset) => {
  if (isLoading) return;
  setisLoading(true);
  const img = await fetchResourceFromURI(asset.uri);
  return Storage.put(`${makeid(10)}+${makeid(5)}.jpg`, img, {
    level: 'public',
    contentType: asset.type,
    progressCallback(uploadProgress) {
      setProgressText(
        `Progress: ${Math.round(
          (uploadProgress.loaded / uploadProgress.total) * 100,
        )} %`,
      );
      console.log(
        `Progress: ${uploadProgress.loaded}/${uploadProgress.total}`,
      );
    },
  })
    .then(res => {
      setProgressText('Upload Done: 100%');
      setisLoading(false);
      Storage.get(res.key)
        .then(result => {
          //console.log(result)
          let updatedUri = result.substring(0,result.indexOf('?'))
          saveImage(updatedUri)
          setImage(updatedUri)
          console.log(updatedUri);
        })
        .catch(err => {
          setProgressText('Upload Error');
          console.log(err);
        });
    })
    .catch(err => {
      setisLoading(false);
      setProgressText('Upload Error');
      console.log(err);
    });
};
////////////////////////////
function saveImage(uri){
  fetch('http://localhost:3000/updateProfilePicture',{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method:'POST',
    body:JSON.stringify({
      uid:auth.currentUser.uid,
      imageUri:uri
    })
  })
  .then((res) => {
    console.log(res);
  }).catch((e) => {
    console.log(e);
  })
}

    return (
    <ScrollView>
        <View style={{height: 45, width: 400, }}>
        </View>
        <View style={{height: 50, width: '100%',}}>
            <View style={{height: 25, width: 25, marginLeft: 300, marginTop: 20, position: 'absolute', 
                    justifyContent: 'center', alignContent: 'center',}}><TouchableOpacity onPress={()=> navigation.navigate('Edit') } >
                <Image source={settings} style={{height: 25, width: 25}}></Image>
            </TouchableOpacity></View>
            <View style={{height: 25, width: 25, marginLeft: 340, marginTop: 20, position: 'absolute',
                    justifyContent: 'center', alignContent: 'center',}}>
                        <TouchableOpacity onPress={() => Alert.alert('Logout','Do you want to log out?',[
                            {
                                text:'Yes',
                                onPress:() => logOut()
                            },
                            {
                                text:'No'
                            }
                        ])}  >

                <Image source={logout} style={{height: 25, width: 25}}></Image>
            </TouchableOpacity></View>
        </View>
    
        <View style={{
          flexDirection:'row'
        }}>
              <View style={{padding:10}}>
                  <Pressable onPress={uploadImage}>
                  {isLoading ? <ActivityIndicator size={'large'} color={'blue'} /> : <Image source={user.profilePicture ? {uri: user.profilePicture } : require('../../assets/user.png') } style={{width:110,height:110, borderRadius:30}} alt={'user logo'} />}
                  </Pressable>
              </View>
      
          <View style={{padding:20}}>
              <View style={{ }}>
                        <Text style={{fontSize: 16}}>Welcome back,</Text>
                  </View>
                  <View style={{ }}>
                        <Text style={{fontSize: 22}}> {auth.currentUser.displayName}</Text>
                  </View>
              </View>
            </View>

        <View style={{height: 70, width: '100%',marginTop: 5}}>
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
            <View style={{ width: '100%', flexDirection: 'row'}}>
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

       <View style={{marginTop: 60,  flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
          {Posts && Posts.map((post, index)=>{
            return(

              <View key={index} style={{height: 100, width: 100, marginLeft: 10, marginTop: 2, }}  >
                 <TouchableOpacity onPress={()=> navigation.navigate('UpdatePost', {updatePost:post})}>
                 <Image style={{height: 100, width: 100, borderRadius: 10}} source={{uri:post.image}}>
                   
                   </Image>
                 </TouchableOpacity>


              </View>

            )
          })}
       </View>
      
      </ScrollView>
    );
  }
export default Profile;


const styles = StyleSheet.create({
    profileWrapper:{
        backgroundColor: '#FFF',
        height: 250,
        width: 370,
        position: 'absolute',
        borderRadius: 30,
        marginLeft: 10,
        marginTop: 120



    },
    circle:{
        height: 100,
        width: 100,
        borderRadius: 70,
        marginLeft: 15,
        marginTop: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderWidth: 0.2,
        borderColor:'#E8EBEE'
    },
    friends:{
        position: 'absolute',
        marginLeft: 205,

        marginTop: 45,
        fontSize: 16
    },
    username1:{
        position: 'absolute',
        marginLeft: 25,
        marginTop: 130,
        fontSize: 16
    },
    posts:{
        position: 'absolute',
        marginLeft: 140,

        marginTop: 45,
        fontSize: 16
    },

    postcount:{
        position: 'absolute',
        marginLeft: 160,

        marginTop: 70,
        fontSize: 16

    },
    friendcount:{
        position: 'absolute',
        marginLeft: 230,
        marginTop: 70,
        fontSize: 16
    },
    likes:{
        position: 'absolute',
        marginLeft: 280,

        marginTop: 45,
        fontSize: 16
    },
    likescount:{
        position: 'absolute',
        marginLeft: 285,
        marginTop: 70,
        fontSize: 16
    },
    options:{
        backgroundColor: '#FFF',
        height: 32,
        width: 370,
        position: 'absolute',
        borderRadius: 30,
        marginLeft: 10,
        marginTop: 380,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
})

