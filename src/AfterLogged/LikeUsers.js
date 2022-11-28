import { View, Text, Image } from 'react-native'
import React from 'react';
import { getAllLikes, getUserData } from './firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import userLogo from '../../assets/user.png';
import { Entypo } from '@expo/vector-icons';

export default function LikeUsers({navigation,route}) {
    const { post } = route.params;
    const [loading,setLoading] = useState(true);
    const [users,setUsers] = useState([])

    let likes = getAllLikes(post.key);

    console.log('ALL LIKES ---- ',likes);

    useEffect(() => {
        if (loading) {
            let usersArray = []
            likes.forEach(like => {
                console.log(like.val().userId)
                let user = getUserData(like.val().userId)
                usersArray.push(user)
            });
            setUsers(usersArray)
        }
    },[loading])
  return (
    <View>
      {users.map((user,index) => {
        return <View 
        key={index}
        style={{
            flexDirection:'row',
            padding:10
        }}
        >
            <View style={{
                width:'40%'
            }}>
            <Image source={userLogo} style={{width:64,height:64}} />
                <Text onPress={() => navigation.navigate('UserProfile',{id:user.key})}>{user.val().username}</Text>
            </View>
            <View>
            <Entypo name="thumbs-up" size={30} color="black" />
            </View>
            </View>
      })}
    </View>
  )
}