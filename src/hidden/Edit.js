import { View, Text, StyleSheet, Image, navigation, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import back from '../../assets/leftarrow.png';
import { useNavigation } from '@react-navigation/native';
import user from '../../assets/user.png'
import check from '../../assets/check.png'
import { getAuth } from 'firebase/auth';
import { getUserData } from '../AfterLogged/firebase';

export default function Edit({navigation}) {
  return (
    <View style={styles.container}>
        <View style={{height: 100, width: '100%', }}>

        <View style={{position: 'absolute', marginTop: 62}}>
            <TouchableOpacity onPress={()=> navigation.navigate('Profile')} 
            style={{ marginLeft: 335, width: 30, height: 30, backgroundColor:'grey'}}>
            <Image source={check} style={{height: 25, width: 25}}></Image>
          </TouchableOpacity></View>
          
        <View style={{position: 'absolute', }}>
          <TouchableOpacity onPress={()=> navigation.navigate('Profile')} 
          style={{ marginTop: 60, marginLeft: 10, width: 35, height: 35, backgroundColor: 'grey'}}>
            <Image source={back} style={{height: 35, width: 35}}/>
          </TouchableOpacity>
          </View>
          
          <View style={{position: 'absolute',marginLeft: 140, marginTop: 60, backgroundColor: 'grey'}}><Text style={{fontSize: 25}} > Settings</Text></View>
        </View>
        <View style={{}}>
          <Text style={{ fontSize: 20, marginLeft: 15, marginTop: 10}}>Profile</Text>
        </View>
        <View style={{backgroundColor: '#ffffff', height: 150, width: 150, justifyContent: 'center', alignItems: 'center', marginLeft: 115, marginTop: 5, borderRadius: 25}}>
            <Image source={user} ></Image>
        </View>
        <View style={{height: 200, width: 360, backgroundColor: '#ffff' ,marginTop: 30, borderRadius: 25, marginLeft: 15}}>

          <View style={{ height: 40, marginTop: 5, borderRadius: 5, width: 100, marginLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 15}}>User</Text>
          </View>
          <View style={{ height: 40, marginTop: 5, borderRadius: 5, width: 100, marginLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 15}}>Email</Text>
          </View>
          <View style={{ height: 40, marginTop: 5, borderRadius: 5, width: 100, marginLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 15}}>Password</Text>
          </View>
          <View style={{ height: 40, marginTop: 5, borderRadius: 5, width: 100, marginLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 15}}>Links</Text>
          </View>

        </View>


    </View>
  )
}

const styles = StyleSheet.create({



})