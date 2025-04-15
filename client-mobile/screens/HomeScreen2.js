import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Button,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
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
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Sidebar from "../components/Sidebar";

const HomeScreen2 = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const logs = useSelector((state) => state.log.log);
  const type = useSelector((state) => state.log.type);

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
      console.log(logs);
      console.log(type)
    };
    fetchToken();
  }, []);

  const renderClipboardCard = (item, i) => (
    <Card
      key={i}
      style={styles.card}
      onPress={async () => {
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
        await Clipboard.setStringAsync(item);
      }}
    >
      {item.type == 1 && <Text category="s1">{item.content}</Text>}
      {item.type == 2 && (
        <Image
          source={{ uri: item.content }}
          style={{ width: 200, height: 200 }}
        />
      )}
      {item.type == 2 && (
        <Button
          title="Download Image"
          onPress={() => saveBase64ToGallery(item.content)}
        />
      )}
    </Card>
  );

  const BackAction = () => (
    <TopNavigationAction
      onPress={()=>{setIsOpen(prev=>(!prev))}}
      icon={(props) => <Icon {...props} name="menu-outline" />}
    />
  );

  const saveBase64ToGallery = async (base64Data) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Allow access to media to save image."
        );
        return;
      }

      // Strip the prefix from base64 data URI
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

      // Pick a file path
      const fileUri = FileSystem.documentDirectory + "downloadedImage.jpg";

      // Write base64 data to file
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save file to gallery
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      Alert.alert("Success", "Image saved to gallery!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save image.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        {/* <Sidebar /> */}
        {isOpen && <Sidebar/>}
        {isOpen}
        <TopNavigation
          alignment="center"
          title="My Clipboard"
          accessoryLeft={BackAction}
        />
        <Divider />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text category="h6" style={styles.subHeading}>
            Welcome back! {isOpen}
          </Text>
          {logs.map((item, i) => type==item.type && renderClipboardCard(item, i))}
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
