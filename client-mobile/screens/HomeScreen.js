import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Divider, Layout, Text } from "@ui-kitten/components";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token)
    };
    fetchUser();
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Layout style={{ flex: 1, justifyContent: "top" }}>
          <TouchableOpacity onPress={() => setOpenSideBar(!openSideBar)}>
            {!openSideBar && (
              <View style={{ padding: 10 }}>
                <Feather name="menu" size={24} color="black" />
              </View>
            )}
          </TouchableOpacity>
          {openSideBar && (
            <View
              style={{
                width: "50%",
                height: "100%",
                padding: 10,
                borderColor: "black",
                borderWidth: 1,
                backgroundColor: "white",
              }}
            >
              <TouchableOpacity onPress={() => setOpenSideBar(!openSideBar)}>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </View>
              </TouchableOpacity>
              <View>
                <Divider style={{ marginVertical: 10 }} />
                <TouchableOpacity>
                  <View>
                    <Text status="primary">Login</Text>
                  </View>
                </TouchableOpacity>
                <Divider style={{ marginVertical: 10 }} />
              </View>
            </View>
          )}
        </Layout>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ECF0F1",
  },
  icon: {
    width: 32,
    height: 32,
  },
});
