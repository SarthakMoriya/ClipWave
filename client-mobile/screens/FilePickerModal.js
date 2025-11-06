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
  Dimensions,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

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
      setType(4);
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
        setType(7);
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
        setType(5);
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
      const fileType = selectedItem.mimeType || "image/jpeg";

      let fileUri = uri;
      if (Platform.OS === "ios") {
        fileUri = uri.replace("file://", "");
      }

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: fileName,
        type: fileType,
      });

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
          {/* Header with accent line */}
          <View style={styles.headerContainer}>
            <View style={styles.accentLine} />
            <Text style={styles.title}>Share Content</Text>
            <Text style={styles.subtitle}>Choose what you want to share</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {/* Image Option */}
              <TouchableOpacity 
                style={styles.optionCard} 
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.iconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="image-outline" size={28} color="#000" />
                  </LinearGradient>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Image</Text>
                  <Text style={styles.optionDesc}>From gallery</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>

              {/* Video Option */}
              <TouchableOpacity 
                style={styles.optionCard} 
                onPress={pickMedia}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#FBBF24', '#F59E0B']}
                    style={styles.iconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="videocam-outline" size={28} color="#000" />
                  </LinearGradient>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Video</Text>
                  <Text style={styles.optionDesc}>From library</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>

              {/* Document Option */}
              <TouchableOpacity 
                style={styles.optionCard} 
                onPress={pickDocument}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#FCD34D', '#FBBF24']}
                    style={styles.iconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="document-outline" size={28} color="#000" />
                  </LinearGradient>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Document</Text>
                  <Text style={styles.optionDesc}>PDF, DOCX, etc.</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}

          {/* Preview Section */}
          {selectedItem && (
            <View style={styles.previewSection}>
              <View style={styles.divider} />
              <Text style={styles.previewLabel}>Selected File</Text>
              
              <View style={styles.previewCard}>
                {type === 7 && (
                  <Image
                    source={{ uri: selectedItem.uri }}
                    style={styles.previewImage}
                  />
                )}
                {type !== 7 && (
                  <View style={styles.fileIconContainer}>
                    <Icon 
                      name={type === 5 ? "videocam" : "document"} 
                      size={32} 
                      color="#F59E0B" 
                    />
                  </View>
                )}
                
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {selectedItem.name || "Selected File"}
                  </Text>
                  {selectedItem.size && (
                    <Text style={styles.fileSize}>
                      {(selectedItem.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={uploadToServer}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.shareGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="share-social-outline" size={20} color="#000" />
                  <Text style={styles.shareText}>Share File</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#111827",
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 2,
    borderTopColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  accentLine: {
    width: 48,
    height: 4,
    backgroundColor: "#F59E0B",
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  iconContainer: {
    marginRight: 14,
  },
  iconGradient: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
  },
  previewSection: {
    marginTop: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 16,
  },
  previewImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#374151",
  },
  fileIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  shareButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  shareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  shareText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  cancelText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FilePickerModal;