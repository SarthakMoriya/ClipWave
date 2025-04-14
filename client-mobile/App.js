import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { io } from "socket.io-client";
import * as Clipboard from "expo-clipboard";
import * as eva from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./SignupScreen";

let socket;
const Stack = createStackNavigator();
export default function App() {
  establishSocketConnection = () => {
    socket = io("http://192.168.1.16:3000");

    socket.on("connect", () => {
      console.log("Connected to Socket");
    });
  };

  checkClipBoard = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    // console.log(clipboardContent);
    if (clipboardContent) {
      socket.emit("clipboard", clipboardContent);
    }
  };
  setInterval(() => {
    // checkClipBoard();
  }, 5000);

  useEffect(() => {
    establishSocketConnection();
  }, []);
  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.light}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
