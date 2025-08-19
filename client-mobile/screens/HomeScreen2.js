import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Alert,
  Text,
  Dimensions,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { LinearGradient } from "expo-linear-gradient";
import Sidebar from "../components/Sidebar";
import { closeNav, openNav } from "../store/states";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

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
    };
    fetchToken();
  }, []);

  const getContentTypeInfo = (type) => {
    const typeMap = {
      1: { icon: "📝", name: "Text", color: "#667eea", bgColor: "#f0f2ff" },
      2: { icon: "🖼️", name: "Image", color: "#ff6b6b", bgColor: "#fff0f0" },
      3: { icon: "🔗", name: "Link", color: "#4facfe", bgColor: "#f0faff" },
      4: { icon: "📄", name: "PDF", color: "#ffa726", bgColor: "#fff8f0" },
      5: { icon: "🎥", name: "Video", color: "#ab47bc", bgColor: "#faf0ff" },
      6: { icon: "📦", name: "APK", color: "#26c6da", bgColor: "#f0feff" },
    };
    return (
      typeMap[type] || {
        icon: "📋",
        name: "Content",
        color: "#666",
        bgColor: "#f5f5f5",
      }
    );
  };

  const renderFileInfo = (content) => {
    if (typeof content === "object" && content.url && content.name) {
      return (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{content.name}</Text>
          <Text style={styles.fileUrl} numberOfLines={2}>
            {content.url}
          </Text>
        </View>
      );
    }
    return null;
  };

  const handleContentPress = async (item) => {
    const { type, content } = item;

    try {
      if (type === 1 || type === 3) {
        // Text or Link
        await Clipboard.setStringAsync(content);
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
      } else if (type === 3) {
        // Link - also offer to open
        Alert.alert("Link Options", "What would you like to do?", [
          { text: "Copy", onPress: () => Clipboard.setStringAsync(content) },
          { text: "Open", onPress: () => Linking.openURL(content) },
          { text: "Cancel", style: "cancel" },
        ]);
      } else if (type === 6 && typeof content === "object") {
        // APK file
        Alert.alert("File Options", `${content.name}`, [
          {
            text: "Copy URL",
            onPress: () => Clipboard.setStringAsync(content.url),
          },
          { text: "Download", onPress: () => Linking.openURL(content.url) },
          { text: "Cancel", style: "cancel" },
        ]);
      } else {
        // Other types - copy content
        await Clipboard.setStringAsync(
          typeof content === "string" ? content : JSON.stringify(content)
        );
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error handling content:", error);
      ToastAndroid.show("Error processing content", ToastAndroid.SHORT);
    }
  };

  const renderClipboardCard = (item, i) => {
    const typeInfo = getContentTypeInfo(item.type);

    return (
      <TouchableOpacity
        key={i}
        onPress={() => handleContentPress(item)}
        style={[styles.card, { borderLeftColor: typeInfo.color }]}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]}
          style={styles.cardGradient}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.typeIndicator,
                { backgroundColor: typeInfo.bgColor },
              ]}
            >
              <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
              <Text style={[styles.typeText, { color: typeInfo.color }]}>
                {typeInfo.name}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="copy-outline" size={18} color={typeInfo.color} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            {(item.type === 1 || item.type === 3) && (
              <Text style={styles.textContent} numberOfLines={4}>
                {item.content}
              </Text>
            )}

            {item.type === 2 && (
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
            )}

            {item.type === 6 && renderFileInfo(item.content)}

            {(item.type === 4 || item.type === 5) && (
              <View style={styles.mediaContainer}>
                <Icon
                  name={item.type === 4 ? "document-outline" : "play-outline"}
                  size={32}
                  color={typeInfo.color}
                />
                <Text style={styles.mediaText}>
                  {item.type === 4 ? "PDF Document" : "Video File"}
                </Text>
                <Text style={styles.mediaSubtext}>Tap to open or copy</Text>
              </View>
            )}
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <Text style={styles.timestampText}>Just now</Text>
            <View style={styles.cardFooterActions}>
              {item.type === 3 && (
                <TouchableOpacity
                  style={[
                    styles.miniButton,
                    { backgroundColor: typeInfo.bgColor },
                  ]}
                  onPress={() => Linking.openURL(item.content)}
                >
                  <Icon name="open-outline" size={14} color={typeInfo.color} />
                  <Text
                    style={[styles.miniButtonText, { color: typeInfo.color }]}
                  >
                    Open
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.miniButton,
                  { backgroundColor: typeInfo.bgColor },
                ]}
                onPress={() => handleContentPress(item)}
              >
                <Icon name="copy-outline" size={14} color={typeInfo.color} />
                <Text
                  style={[styles.miniButtonText, { color: typeInfo.color }]}
                >
                  Copy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const BackAction = () => (
    <TouchableOpacity
      onPress={() => {
        isOpen ? dispatch(closeNav()) : dispatch(openNav());
      }}
      style={styles.menuButton}
    >
      <Icon name="menu-outline" size={24} color="#FFFFFF" />
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

  const filteredLogs = logs.filter((item) => type === item.type);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
        {isOpen && <Sidebar />}

        {/* Header */}
        <View style={styles.header}>
          {BackAction()}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>ClipWave</Text>
            <Text style={styles.headerSubtitle}>My Clipboard</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <TouchableWithoutFeedback onPress={() => dispatch(closeNav())}>
          <View style={styles.contentContainer}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back! 👋</Text>
              <Text style={styles.welcomeSubtext}>
                {filteredLogs.length} items ready to share
              </Text>
            </View>

            {/* Content Cards */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {filteredLogs.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📋</Text>
                  <Text style={styles.emptyTitle}>No items yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Start sharing content to see it here
                  </Text>
                </View>
              ) : (
                filteredLogs.map((item, i) => renderClipboardCard(item, i))
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
  },
  welcomeSection: {
    padding: 24,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 0,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  typeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2d3748",
    backgroundColor: "#f7fafc",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imageContainer: {
    position: "relative",
  },
  imageContent: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f7fafc",
  },
  downloadButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  downloadGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  downloadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  fileInfo: {
    backgroundColor: "#f7fafc",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 6,
  },
  fileUrl: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "monospace",
  },
  mediaContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f7fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  mediaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3748",
    marginTop: 8,
  },
  mediaSubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  timestampText: {
    fontSize: 12,
    color: "#a0aec0",
    fontWeight: "500",
  },
  cardFooterActions: {
    flexDirection: "row",
  },
  miniButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  miniButtonText: {
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default HomeScreen2;
