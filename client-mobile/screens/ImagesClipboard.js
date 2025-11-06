import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/HomeScreen2.styles";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const ImagesClipboard = ({ item }) => {

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
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.content }}
        style={styles.imageContent}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => saveBase64ToGallery(item.content)}
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
