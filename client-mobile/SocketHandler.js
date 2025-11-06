// src/components/SocketManager.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { addLog } from "./store/clipboard";
import * as Sharing from "expo-sharing";

let socket;

const SocketManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // socket = io("http://192.168.1.14:3000");
    socket = io("http://192.168.1.15:3000");

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
      socket.on("new-apk-available", async ({ url, name, mimeType }) => {
        try {
          const fileUri = `${FileSystem.documentDirectory}${name}`;

          const { uri } = await FileSystem.downloadAsync(url, fileUri);
          console.log(`URI:${uri}`);
          console.log(`MIME TYPE:${mimeType}`);

          // await Sharing.shareAsync(uri, {
          //   mimeType,
          //   dialogTitle: "Open file with...",
          // });

          if (mimeType === "application/vnd.android.package-archive") {
            dispatch(addLog({ payload: { url, name }, type: 6 }));
          } else if (mimeType.startsWith("video/")) {
            console.log(`Video received ${url}::${name}`)
            dispatch(addLog({ payload: { url, name }, type: 5 }));
          } else if (mimeType.startsWith("image/")) {
            console.log('adding image the 2nd way')
            dispatch(addLog({ payload: { url, name }, type: 2 }));
          } else if(mimeType.startsWith("application/pdf")) {
            console.log("Adding PDF...")
            dispatch(addLog({ payload: { url, name }, type: 4 }));
          }

          console.log(`✅ Opened ${name} (${mimeType})`);
        } catch (err) {
          console.error("❌ Error opening file:", err);
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
