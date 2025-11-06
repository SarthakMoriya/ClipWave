import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Platform } from "react-native";

const FilePickerModal = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [type, setType] = useState(null);

  // 📄 Pick any file (PDF, DOCX, ZIP, etc.)
  const pickDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      setLoading(false);

      if (result.type === "cancel") return;
      setSelectedItem(result.assets ? result.assets[0] : result);
      setType(4); // document
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Unable to pick document");
    }
  };

  // 🖼 Pick image from gallery
  const pickImage = async () => {
    try {
      setLoading(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Please allow access to gallery.");
        setLoading(false);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });
      setLoading(false);

      if (!result.canceled) {
        setSelectedItem(result.assets[0]);
        setType(7); // image
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      Alert.alert("Error", "Unable to pick image");
    }
  };

  // 🎥 Pick video
  const pickMedia = async () => {
    try {
      setLoading(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Please allow access to media.");
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        quality: 1,
      });
      setLoading(false);

      if (!result.canceled) {
        setSelectedItem(result.assets[0]);
        setType(5); // video
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Unable to pick video");
    }
  };

  // 🚀 Upload selected file to your Node.js server
  const uploadToServer = async () => {
    if (!selectedItem) {
      Alert.alert("No file selected");
      return;
    }

    try {
      setLoading(true);
      console.log(Object.keys(selectedItem));
      const uri = selectedItem.uri;
      console.log(uri);
      const fileName =
        selectedItem.name || uri.split("/").pop() || "upload_file";
      const fileType = selectedItem.mimeType || "image/jpeg"; // fallback for images

      // ✅ Convert `file://` URI to a valid format for upload
      let fileUri = uri;
      if (Platform.OS === "ios") {
        fileUri = uri.replace("file://", "");
      }

      const formData = new FormData();
      formData.append("file", {
        uri: uri, // always keep it as `uri`
        name: fileName,
        type: fileType,
      });

      // ✅ Use fetch instead of axios for React Native FormData (more reliable)
      const response = await fetch("http://192.168.1.15:3000/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      console.log("✅ Uploaded:", data);

      Alert.alert("Success", "File shared successfully!");
      setSelectedItem(null);
      onClose();
    } catch (error) {
      console.error("❌ Upload error:", error);
      Alert.alert("Error", "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select File to Share</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#667eea"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <>
              <TouchableOpacity style={styles.option} onPress={pickImage}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.optionGradient}
                >
                  <Icon name="image-outline" size={22} color="#fff" />
                  <Text style={styles.optionText}>Pick Image</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={pickMedia}>
                <LinearGradient
                  colors={["#43cea2", "#185a9d"]}
                  style={styles.optionGradient}
                >
                  <Icon name="videocam-outline" size={22} color="#fff" />
                  <Text style={styles.optionText}>Pick Video</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={pickDocument}>
                <LinearGradient
                  colors={["#00b09b", "#96c93d"]}
                  style={styles.optionGradient}
                >
                  <Icon name="document-outline" size={22} color="#fff" />
                  <Text style={styles.optionText}>Pick Document / PDF</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* 📂 Preview selected file */}
          {selectedItem && (
            <View style={styles.previewContainer}>
              {type === 7 && (
                <Image
                  source={{ uri: selectedItem.uri }}
                  style={styles.previewImage}
                />
              )}

              <Text style={styles.previewName}>
                {selectedItem.name || "Selected File"}
              </Text>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={uploadToServer}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.shareGradient}
                >
                  <Icon name="share-social-outline" size={18} color="#fff" />
                  <Text style={styles.shareText}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    marginBottom: 12,
  },
  optionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  previewContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  previewName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  shareButton: {
    marginTop: 8,
  },
  shareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  shareText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  closeButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 10,
  },
  closeText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default FilePickerModal;
