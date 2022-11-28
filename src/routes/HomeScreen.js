import React, {Component, Fragment} from 'react';
import {View, Text, Image, style, StyleSheet, Tab, Stack, Button, } from 'react-native';
import { NavigationContainer, Navigator, useIsFocused  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../AfterLogged/Profile';
import Home from '../AfterLogged/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Users from '../AfterLogged/Users';
import Edit from '../hidden/Edit';
import ChatRoom from '../AfterLogged/ChatRoom';
import UserProfile from '../AfterLogged/UserProfile';
import Comment from '../hidden/Comment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SentIcon from '../../assets/sent.png'
import Post from '../AfterLogged/CreatePost'
import { onFocus } from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';
import CreatePost from '../AfterLogged/CreatePost';
import Notification from '../AfterLogged/Notification';
import StoryToProfile from '../AfterLogged/StoryToProfile';
import LikeUsers from '../AfterLogged/LikeUsers';
import Chat from '../AfterLogged/Chat';
import UpdatePost from '../AfterLogged/UpdatePost';

const AppStack = createNativeStackNavigator();

export default class App extends Component {
  render =()=>{
    return (
      <NavigationContainer>
        <AppStack.Navigator >
        <AppStack.Screen name="Home" component={HomeTabs} options={{headerShown: false}} />
        <AppStack.Screen name="UpdatePost" component={UpdatePost} options={{
          headerShown:false
        }}/>
        <AppStack.Screen name="UserProfile" component={UserProfile} />
        <AppStack.Screen name="Comments" component={Comment} />
        <AppStack.Screen name="Chat Room" component={ChatRoom}/>
        <AppStack.Screen name="Edit" component={Edit} options={{
          headerShown:false }}/>
        <AppStack.Screen name="Post" component={Post} options={{
          headerShown:false
        }}/>
        <AppStack.Screen name="Notification" component={Notification}/>
        <AppStack.Screen name="User Profile" component={StoryToProfile}/>
        <AppStack.Screen name='LikeUsers' component={LikeUsers} />
        <AppStack.Screen name='Chat' component={Chat} options={{
          headerShown:false
        }} />
      </AppStack.Navigator>
      </NavigationContainer>
    );
  }
}
const TabScreen = createBottomTabNavigator();

function HomeTabs({navigation}) {
  return (
    <TabScreen.Navigator tabBarOptions={{
      showLabel:false,
      tabBarActiveTintColor: '#fffff',
      tabBarInactiveTintColor: '#586589',
      
  }}>
      <TabScreen.Screen name="Posts" component={Home} options={{
        tabBarLabel: '',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Image
            style={{ width: 25,
              marginTop: 8,
            height: 25,}}
            source={require('../../assets/home.png')                  
            }/>
       ),          
      }}/>
      <TabScreen.Screen name="Users" component={Users} options={{
        tabBarLabel: '',
      tabBarIcon: () => (
        <Image
          style={{ width: 25,
            marginTop: 8,
          height: 25,}}
          source={require('../../assets/users.png')                  
          }/>
     ), 
    
    }}/>
    <TabScreen.Screen name="Add" component={CreatePost} options={{
        tabBarLabel: '',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Image
            style={{ width:30,
            height: 30}}
            source={require('../../assets/add.png')                  
            }/>
       ),             
      }} />
    <TabScreen.Screen name="Chat Room" component={ChatRoom} options={{
      tabBarLabel: '',
        
        tabBarIcon: ({ color }) => (
          <Image
            style={{ width: 25,
              marginTop: 8,
            height: 25}}
            source={require('../../assets/chat.png')                  
            }/>
       ),             
      }} />
      <TabScreen.Screen name="Profile" component={Profile} options={{
        tabBarLabel: '',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Image
            style={{ width: 25,
              marginTop: 8,
            height: 25}}
            source={require('../../assets/user.png')                  
            }/>
       ),             
      }} />

    </TabScreen.Navigator>
  );
}

