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
  Text,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Sidebar from "../components/Sidebar";
import { closeNav, openNav } from "../store/states";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen2 = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.log.log);
  const type = useSelector((state) => state.log.type);
  const isOpen = useSelector((state) => state.extra.isnavOpen);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setUser(token);
      console.log(isOpen);
    };
    fetchToken();
  }, []);

  const renderClipboardCard = (item, i) => (
    <View key={i} style={styles.card}>
      <TouchableOpacity
        onPress={async () => {
          ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
          await Clipboard.setStringAsync(item.content);
        }}
        style={styles.cardTouchable}
      >
        {(item.type === 1 || item.type === 3) && (
          <Text style={styles.cardText}>{item.content}</Text>
        )}
        {item.type === 2 && (
          <Image
            source={{ uri: item.content }}
            style={{ width: "100%", height: 200, resizeMode: "contain" }}
          />
        )}
      </TouchableOpacity>
      {item.type === 2 && (
        <Button
          title="Download Image"
          onPress={() => saveBase64ToGallery(item.content)}
        />
      )}
    </View>
  );

  const BackAction = () => (
    <TouchableOpacity
      onPress={() => {
        isOpen ? dispatch(closeNav()) : dispatch(openNav());
      }}
      style={styles.backButton}
    >
      <Icon name="menu-outline" size={26} color="#000" />
    </TouchableOpacity>
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

      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const fileUri = FileSystem.documentDirectory + "downloadedImage.jpg";

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

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
      <View style={styles.container}>
        {isOpen && <Sidebar />}

        <View style={styles.topBar}>
          {BackAction()}
          <Text style={styles.topBarTitle}>My Clipboard</Text>
          <View style={{ width: 26 }} /> {/* Placeholder for symmetry */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.subHeading}>
            Welcome back!
          </Text>
          {logs.map(
            (item, i) => type === item.type && renderClipboardCard(item, i)
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTouchable: {
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  subHeading: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});
