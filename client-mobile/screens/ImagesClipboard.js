import React from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import styles from "../styles/HomeScreen2.styles";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const ImagesClipboard = ({ item }) => {
  console.log(item)
  const saveImageToGallery = async (url, name) => {
    try {
      if (!url) {
        Alert.alert("❌ Error", "Invalid image URL.");
        return;
      }

      // ✅ Ask for permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow access to media library.");
        return;
      }

      // ✅ Derive a valid file name and extension
      const fileExtension = name?.split(".").pop() || "jpg";
      const safeName = name?.replace(/[^a-zA-Z0-9._-]/g, "_") || `image.${fileExtension}`;
      const fileUri = `${FileSystem.documentDirectory}${safeName}`;

      console.log("⬇️ Downloading:", url);
      console.log("📂 Saving as:", fileUri);

      // ✅ Download file to app storage
      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      // ✅ Save downloaded file to gallery
      const asset = await MediaLibrary.createAssetAsync(uri);

      // On Android 13+, the default album name might be ignored, so check platform
      const albumName = Platform.OS === "android" ? "Downloads" : "Download";
      await MediaLibrary.createAlbumAsync(albumName, asset, false);

      Alert.alert("✅ Success", `Image saved to ${albumName} folder!`);
    } catch (error) {
      console.error("❌ Error saving image:", error);
      Alert.alert("Error", "Failed to save image. Please try again.");
    }
  };

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.content.url }}
        style={styles.imageContent}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => saveImageToGallery(item.content.url, item.content.name)}
      >
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          style={styles.downloadGradient}
        >
          <Icon name="download-outline" size={16} color="#fff" />
          <Text style={styles.downloadText}>Save Image</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ImagesClipboard;
