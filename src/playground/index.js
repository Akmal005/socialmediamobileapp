import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function Playground(props) {
  
  return (
    <View style={styles.container}>
      <Text>{props.title}</Text>
      <Image source={props.imageUrl} style={{width:100,height:100}} />
      <Text style={styles.body}>{props.body}</Text>
      <Text>{props.date}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    body:{
        fontSize:18
    }
})