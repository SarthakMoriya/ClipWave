// src/components/SocketManager.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as MediaLibrary from "expo-media-library";
import { addLog } from "./store/clipboard";
import { Alert } from "react-native";

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
      dispatch(addLog({ payload: data, type: 1 }));
    });
    socket.on("clipboard-img", (data) => {
      console.log("COPIED IMAGE RECEIVED", data);
      dispatch(addLog({ payload: data, type: 2 }));
    });
    socket.on("clipboard-url", (data) => {
      console.log("COPIED URL RECEIVED", data);
      dispatch(addLog({ payload: data, type: 3 }));
    });
    try {
      socket.on("new-apk-available", async ({ url, name }) => {
        try {
          const fileUri = `${FileSystem.documentDirectory}${name}`;

          const { uri } = await FileSystem.downloadAsync(url, fileUri);

          // Launch Android package installer
          IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: uri,
            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            type: "application/vnd.android.package-archive",
          });
          console.log(url,name)
          dispatch(addLog({ payload: {url,name}, type: 6 }));
        } catch (err) {
          console.error("❌ Error downloading APK:", err);
        }
      });
    } catch (error) {
      console.log(error);
    }

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
