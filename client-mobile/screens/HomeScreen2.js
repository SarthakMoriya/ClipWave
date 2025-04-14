import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ToastAndroid,
  Image
} from "react-native";
import * as Clipboard from 'expo-clipboard';
import {
  Layout,
  Text,
  Divider,
  Card,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const HomeScreen2 = () => {
  const [user, setUser] = useState(null);
  const logs=useSelector(state=>state.log.log)

  const clipboardData = [
    { id: "1", content: "Copied link: https://github.com" },
    { id: "2", content: "Copied OTP: 123456" },
    { id: "3", content: "Copied email: user@example.com" },
    { id: "4", content: "Copied address: 221B Baker Street" },
  ];

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setUser(token);
      console.log(logs)
    };
    fetchToken();
  }, []);

  const renderClipboardCard = (item,i) => (
    <Card key={i} style={styles.card} 
    onPress={async () => {
      ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
      await Clipboard.setStringAsync(item)
    }}>
      {item.type==1 && <Text category="s1">{item.content}</Text>}
      {item.type==2 && <Image source={{ uri: item.content }} style={{ width: 200, height: 200 }} />}
    </Card>
  );

  const BackAction = () => (
    <TopNavigationAction
      icon={(props) => <Icon {...props} name="menu-outline" />}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <TopNavigation
          alignment="center"
          title="My Clipboard"
          accessoryLeft={BackAction}
        />
        <Divider />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text category="h6" style={styles.subHeading}>
            Welcome back!
          </Text>
          {logs.map((item,i) => renderClipboardCard(item,i))}
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  subHeading: {
    marginBottom: 12,
  },
});
