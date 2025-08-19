// src/components/SocketManager.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import * as Clipboard from "expo-clipboard";
import { addLog } from "./store/clipboard";

let socket;

const SocketManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket = io("http://192.168.1.16:3000");

    socket.on("connect", () => {
      console.log("Connected to Socket");
    });

    socket.on("clipboard", (data) => {
      console.log("COPIED DATA RECEIVED", data);
      dispatch(addLog({payload:data,type:1}));
    });
    socket.on("clipboard-img", (data) => {
      console.log("COPIED IMAGE RECEIVED", data);
      dispatch(addLog({payload:data,type:2}));
    });
    socket.on("clipboard-url", (data) => {
      console.log("COPIED URL RECEIVED", data);
      dispatch(addLog({payload:data,type:3}));
    });
    socket.on("clipboard-apk",(data)=>{
      console.log("Apk file detected")
      console.log(data)
    })

    // const checkClipBoard = async () => {
    //   const clipboardContent = await Clipboard.getStringAsync();
    //   if (clipboardContent) {
    //     socket.emit("clipboard", clipboardContent);
    //   }
    // };

    const interval = setInterval(() => {
      // checkClipBoard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return null; // This is a background component
};

export default SocketManager;
