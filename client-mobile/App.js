import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PermissionsAndroid, Platform } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen2 from "./screens/HomeScreen2";
import SignupScreen from "./screens/SignupScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "./store/store";
import { Provider } from "react-redux";
import SocketManager from "./SocketHandler";
import * as FileSystem from "expo-file-system";
async function listFiles() {
  try {
    console.log("ttt", FileSystem.documentDirectory);
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    console.log("📂 Files in Expo storage:", files);
  } catch (error) {
    console.log(error);
  }
}

listFiles();

const requestStoragePermission = async () => {
  listFiles();
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const Stack = createStackNavigator();
export default function App() {
  requestStoragePermission();
  const checkToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SocketManager />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
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
