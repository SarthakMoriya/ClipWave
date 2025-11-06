import React from "react";
import {Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import styles from "../styles/HomeScreen2.styles";

const PdfsClipboard = ({ item, color }) => {
  const handleOpenPdf = async () => {
    try {
      const { name, url } = item.content;

      // 📥 Download PDF to local storage
      const fileUri = `${FileSystem.documentDirectory}${name}`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      // ✅ Convert to content URI for Android
      const contentUri = await FileSystem.getContentUriAsync(uri);
      console.log(contentUri)

      // 📂 Open with any PDF viewer installed on the device
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: "application/pdf",
      });
    } catch (error) {
      console.error("❌ Error opening PDF:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleOpenPdf} style={styles.mediaContainer}>
      <Icon name="document-outline" size={32} color={color} />
      <Text style={styles.mediaText}>PDF Document</Text>
      <Text style={styles.mediaSubtext}>{item.content.name}</Text>
    </TouchableOpacity>
  );
};

export default PdfsClipboard;
