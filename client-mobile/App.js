import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { io } from "socket.io-client";
import * as Clipboard from 'expo-clipboard';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import HomeScreen from './screens/HomeScreen';

let socket;

export default function App() {

  establishSocketConnection=()=>{
    socket = io('http://192.168.1.16:3000');

    socket.on('connect',()=>{
      console.log("Connected to Socket")
    })
  }

  checkClipBoard=async()=>{
    const clipboardContent = await Clipboard.getStringAsync();
    console.log(clipboardContent)
    if(clipboardContent){
      socket.emit('clipboard', clipboardContent)
    }
  }
  setInterval(()=>{
    checkClipBoard()
  },5000)

  useEffect(()=>{
    establishSocketConnection()
  },[])
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
    <HomeScreen />
  </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})