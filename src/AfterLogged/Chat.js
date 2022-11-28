import { View, Text, TextInput, TouchableOpacity, Dimensions, Alert, ScrollView, Image } from 'react-native'
import React from 'react';
import { getUserData, createChat, getChat, getUsername, getUser } from './firebase';
import { useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import moment from 'moment';
import userpng from '../../assets/user.png'
import leftarrow from '../../assets/leftarrow.png'
moment.locale('uz');
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function Chat({navigation,route}) {
    const { item } = route.params;
    let date = new Date().toString();
    let db = getDatabase();
    let auth = getAuth();

    const [loading,setLoading] = useState(true);
    const [image, setImage] = useState(null);


    const [chatMsgs,setChatMsgs] = useState([])

    const [message,setMessage] = useState(null);

    const scrollRef = useRef();

console.log('ITEM --- ', item);

    const sendMessage = () => {
       fetch(`http://localhost:3000/createChat`,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method:'post',
        body:JSON.stringify({
          message,
          image,
          uid:auth.currentUser.uid,
          item
        })
       })
       .then(res => {
        console.log(res);
        setMessage(null)
        setImage(null)
       })
       .catch(e => console.log(e)) 
    }

    const attachFile = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    };


   useEffect(() => {
    fetch(`http://localhost:3000/getChat`,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'GET'
    })
    .then(res => res.json())
    .then((chats) => {
      let chatsArray = []
        chats.forEach((chat) => {
          console.log('CHAT ------------------ ',chat);
          if (chat.otherUser === item.otherUser._id && chat.currentUserId === item.currentUser._id) {
            chatsArray.push(chat)
          }else if (chat.otherUser === item.currentUser._id && chat.currentUserId === item.otherUser._id) {
            
          }
        })
        setChatMsgs(chatsArray)
    })
    .catch(e => {
        console.log(e.message)
    })
   },[chatMsgs])

  return (
    <View style={{
        flex:1
    }}>
      <View 
      style={{
        backgroundColor:'white',
        height: 100, 
        width: '100%', 
        shadowRadius: 7,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        opacity:0.9,
                  }}>
          <View style={{height: 40, width: 200, marginTop: 50, marginLeft: 170, justifyContent: 'center'}}>
            <Text style={{fontSize: 18}}>{getUsername(item.friendId)}</Text>
          </View>
          <View style={{height: 45, width: 45, borderRadius: 40, position: 'absolute', marginTop: 45, marginLeft: 120, justifyContent: 'center', alignItems: 'center'}} >
            <Image source={userpng} style={{height: 30, width: 30}}></Image>
          </View>
          <TouchableOpacity onPress={()=> navigation.goBack()} style={{height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', marginTop: 55, marginLeft: 15}} >
              <Image source={leftarrow} style={{height: 35, width: 35}}></Image>
          </TouchableOpacity>
      </View>

      <View style={{
        flex:7,
      }}>
        <ScrollView 
      
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated:true })}
        >
        {chatMsgs.map((chat,index) => (
            <View
            key={index} 
            style={{
              display:'flex',
              flex:1,
              justifyContent:'space-between',
          
            }}>

              <View style={{
                alignItems:chat.uid !== getAuth().currentUser.uid ? 'flex-start':'flex-end',
                display:'flex', 
              }}>
                {!!chat.message && <View>
                  <View style={{
                  borderRadius:20,
                  backgroundColor:chat.uid !== getAuth().currentUser.uid ?'gray' :'blue',
                  borderBottomRightRadius:5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 4,
                  shadowRadius: 3,
                  shadowColor: 'black',
                  shadowOpacity: 0.2,
                  
                }}>
                <Text
                 style={{
                  color:'#fff',
                  padding: 10,
                  fontSize:15,
               

                }}>
                  {chat.message}
                </Text>

                </View>
                <Text style={{marginBottom:10, fontSize: 10}}>{moment(chat.date).startOf('seconds').fromNow()}</Text>
                </View>  }

                  {<View>
                  <View >
                {!!chat.image && <Image style={{width:200,height:200}} source={{uri:chat.image}} />}
                </View>
                <Text style={{marginBottom:10}}>{chat.image && moment(chat.date).startOf('seconds').fromNow()}</Text>
                  </View>}
              </View>

            </View>
        ))}
        </ScrollView>
      </View>

      <View style={{
        flex:1,
        width:Dimensions.get('screen').width,
        flexDirection:'row'
      }}>
        

        <View style={{
          flex: 1,
          flexDirection: 'row',
          borderTopWidth: 0.2,
          
          borderTopColor: 'black',
          alignItems: 'center',
        }}>
    {!!image && <Image style={{width:40,height:40}} source={{uri:image}} />}
    <TextInput
    style={{
     
      paddingLeft:5,
      height:40,
      backgroundColor: 'white',
      marginLeft: 5,
      borderRadius: 10,
      width: 270,
      marginLeft: 15
    }}
    value={message}
        placeholder="Type a message ..."
        onChangeText={(text) => {setMessage(text)}}
        underlineColorAndroid="transparent"
    />

<FontAwesome onPress={attachFile} name="picture-o" size={35} color="black" style={{marginLeft: 5}} /> 

<FontAwesome onPress={sendMessage} name="send" size={35} color="black"  style={{marginLeft: 5}}/>

</View>
      </View>

    </View>
  )
}