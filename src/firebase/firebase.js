import { Text, View } from 'react-native'
import React, { Component, createContext } from 'react'

export const FirebaseContext = createContext();

export default class FirebaseContextProvider extends Component {
   

constructor(props){
    super(props)
    this.state={
        firebaseConfig: null
    }
}

    componentDidMount(){
        fetch(`http://localhost:3000/firebaseConfig`)
        .then(res => res.json())
        .then(data => {
            this.setState({firebaseConfig:data})
            console.log(data)
        })
        .catch(e => console.log(e.message))
    }

  render() {
    return (
      <FirebaseContext.Provider value={{...this.state}}>
        {this.props.children }
      </FirebaseContext.Provider>
    )
  }
}