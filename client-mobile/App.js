import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { io } from "socket.io-client";
import * as Clipboard from "expo-clipboard";
import * as eva from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen2 from "./screens/HomeScreen2";
import SignupScreen from "./screens/SignupScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { addLog } from "./store/clipboard";
import { useDispatch } from "react-redux";
import SocketManager from "./SocketHandler";


const Stack = createStackNavigator();
export default function App() {
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
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
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
        </ApplicationProvider>
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
