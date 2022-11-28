import { View, Text, TextInput, TouchableHighlight, Alert, StyleSheet,InputAccessoryView, Button, 
    Image,
    Pressable,TouchableOpacity, ActivityIndicator  } from "react-native";
import React, {useLayoutEffect, useState} from "react";
import * as ImagePicker from 'expo-image-picker';
import { push, ref, getDatabase, set} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { createPost, } from './firebase'

import Amplify, {Storage} from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

const CreatePost = ({navigation, route}) => {

    let auth = getAuth()
    let date = new Date().toString()
    const {updatePost} = route.params;
    const [image, setImage] = useState(null);
    const [image2,setImage2] = useState(null);
    const [body,setBody] = useState('')
    const [loading,setLoading] = useState(true)

    const [progressText, setProgressText] = useState('');
    const [isLoading, setisLoading] = useState(false);

    const inputAccessoryViewID = 'uniqueID';
   

  
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
        uploadResource(result)
    
        if (!result.cancelled) {
          console.log('Image upload started..');
        }

      };

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
           if (!image) {
            setImage(updatedUri)
           } else {
            setImage2(updatedUri)
           }
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

function replacePost(uid,body,image,image2,date){
    fetch('http://localhost:3000/updatePost',
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'POST',
        body:JSON.stringify({
            uid,
            body:body ? body : updatePost.body,
            image:image ? image : updatePost.image,
            image2:image2 ? image2 : updatePost.image2,
            date
        })
    })
    .then((res) => {
        console.log(res)
    })
    .catch(e => {
        console.log(e.message)
    })
}


  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <MaterialIcons style={styles.leftArrowIcon} onPress={() => navigation.goBack()} name="arrow-back-ios" size={24} color="black" />
        <Text style={styles.headerTop}>Post</Text>
        <TouchableHighlight onPress={() => {
          {updatePost ? replacePost(auth.currentUser.uid,body,image,image2,date)  : createPost(auth.currentUser.uid,body,image,image2,date)
            setBody('')
            setImage(null)
            setImage2(null)
            navigation.navigate('Posts')
            }}} style={styles.btn}><Text style={styles.textBtn}>{updatePost ? 'Update' : 'Create'}</Text></TouchableHighlight>
        </View>
        
       {updatePost ? <View style={{flexDirection:'row'}}>
        {updatePost.image && <Pressable onPress={() => setImage(null)}><Image source={{ uri: updatePost.image }} style={{ width: 210, height: 200}} /></Pressable>}
        {updatePost.image2 && <Pressable onPress={() => setImage2(null)}><Image  source={{ uri: updatePost.image }} style={{ width:210, height: 200}} /></Pressable>}
        {isLoading && <ActivityIndicator size={'large'} color={'blue'} />}
        </View> : <View style={{flexDirection:'row'}}>
        {image && <Pressable onPress={() => setImage(null)}><Image source={{ uri: image }} style={{ width: 210, height: 200}} /></Pressable>}
        {image2 && <Pressable onPress={() => setImage2(null)}><Image  source={{ uri: image2 }} style={{ width:210, height: 200}} /></Pressable>}
        {isLoading && <ActivityIndicator size={'large'} color={'blue'} />}
        </View> }
        {updatePost ?  <TextInput 
        value={updatePost.body}
        onChangeText={(text) => {setBody(text)} }
        placeholder="Type something .."
        style={styles.input}
        maxLength={700}
        multiline
        inputAccessoryViewID={inputAccessoryViewID}
        /> : <TextInput 
        value={body}
        onChangeText={(text) => {setBody(text)} }
        placeholder="Type something .."
        style={styles.input}
        maxLength={700}
        multiline
        inputAccessoryViewID={inputAccessoryViewID}
        />}
        <View style={{
           flexDirection:'row',
           padding:2,
           marginLeft: 5,
           marginRight: 5,
       }}>
       <Pressable onPress={pickImage}>
        <Image style={{width:40,height:40, marginRight:2}} source={require('../../assets/gallery.png')} />
       </Pressable>
       <Pressable onPress={() => Alert.alert('Camera')}>
        <Image style={{width:40,height:40,marginRight:2}} source={require('../../assets/camera.png')} />
        </Pressable>
       </View>
        {/* <InputAccessoryView 
        nativeID={inputAccessoryViewID}>
       
      </InputAccessoryView> */}
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fffff'
    },
    header:{
        flexDirection:'row',
        paddingTop:50,
        justifyContent:'space-evenly',
        paddingBottom:20,
        backgroundColor: '#fffff'
    },
    leftArrowIcon:{
        padding:5
    },
    headerTop:{
        padding:5,
        fontSize:16
    },
    container:{
        justifyContent:'center',
    },
    btn:{
        backgroundColor:'green',
        height:35,
        margin:3,
        padding:8,
        borderRadius:20
    },
    textBtn:{
        color:'#ffffff',
        textAlign:'center',
    },
    input:{
        height:150,
        padding:10,
        borderRadius: 5,
        padding: 15,
        marginTop: 5
    
    },
    InputAccessoryView:{
        backgroundColor:'#fffff'
    }
})