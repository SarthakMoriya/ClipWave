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
import { LinearGradient } from "expo-linear-gradient";
import Sidebar from "../components/Sidebar";
import { closeNav, openNav } from "../store/states";
import Icon from "react-native-vector-icons/Ionicons";
import { removeLogs } from "../store/clipboard";
import VideosClipboard from "./VideosClipboard";
import PdfsClipboard from "./PdfsClipboard";
import TextClipboard from "./TextClipboard";
import ImagesClipboard from "./ImagesClipboard";
import FilePickerModal from "./FilePickerModal";

const { width } = Dimensions.get("window");

const HomeScreen2 = () => {
  const [user, setUser] = useState(null);
  const [openSubMenuTab, setOpenSubMenuTab] = useState(false);
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.log.log);
  const type = useSelector((state) => state.log.type);
  const isOpen = useSelector((state) => state.extra.isnavOpen);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setUser(token);
    };
    console.log(logs);
    fetchToken();
  }, []);

  const getContentTypeInfo = (type) => {
    const typeMap = {
      1: { icon: "document-text", name: "Text", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.15)" },
      2: { icon: "image", name: "Image", color: "#FBBF24", bgColor: "rgba(251, 191, 36, 0.15)" },
      3: { icon: "link", name: "Link", color: "#FCD34D", bgColor: "rgba(252, 211, 77, 0.15)" },
      4: { icon: "document", name: "PDF", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.15)" },
      5: { icon: "videocam", name: "Video", color: "#D97706", bgColor: "rgba(217, 119, 6, 0.15)" },
      6: { icon: "folder", name: "APK", color: "#FBBF24", bgColor: "rgba(251, 191, 36, 0.15)" },
      7: { icon: "images", name: "Gallery", color: "#FCD34D", bgColor: "rgba(252, 211, 77, 0.15)" },
    };
    return (
      typeMap[type] || {
        icon: "clipboard",
        name: "Content",
        color: "#9CA3AF",
        bgColor: "rgba(156, 163, 175, 0.15)",
      }
    );
  };

  const renderFileInfo = (content) => {
    if (typeof content === "object" && content.url && content.name) {
      return (
        <View style={styles.fileInfo}>
          <Icon name="document-attach" size={32} color="#F59E0B" />
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>{content.name}</Text>
            <Text style={styles.fileUrl} numberOfLines={1}>
              {content.url}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const handleContentPress = async (item) => {
    const { type, content } = item;

    try {
      if (type === 1 || type === 3) {
        await Clipboard.setStringAsync(content);
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
      } else if (type === 3) {
        Alert.alert("Link Options", "What would you like to do?", [
          { text: "Copy", onPress: () => Clipboard.setStringAsync(content) },
          { text: "Open", onPress: () => Linking.openURL(content) },
          { text: "Cancel", style: "cancel" },
        ]);
      } else if (type === 6 && typeof content === "object") {
        Alert.alert("File Options", `${content.name}`, [
          {
            text: "Copy URL",
            onPress: () => Clipboard.setStringAsync(content.url),
          },
          { text: "Download", onPress: () => Linking.openURL(content.url) },
          { text: "Cancel", style: "cancel" },
        ]);
      } else {
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

  const clearLogs = () => {
    dispatch(removeLogs({ type: type }));
  };

  const renderClipboardCard = (item, i) => {
    const typeInfo = getContentTypeInfo(item.type);
    
    return (
      <TouchableOpacity
        key={i}
        onPress={() => handleContentPress(item)}
        style={styles.card}
        activeOpacity={0.8}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.typeIndicator, { backgroundColor: typeInfo.bgColor }]}>
            <Icon name={typeInfo.icon} size={18} color={typeInfo.color} />
            <Text style={[styles.typeText, { color: typeInfo.color }]}>
              {typeInfo.name}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleContentPress(item)}
          >
            <Icon name="copy-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          {(item.type === 1 || item.type === 3) && (
            <TextClipboard numberOfLines={4} content={item.content} />
          )}

          {(item.type === 2 || item.type === 7) && (
            <ImagesClipboard item={item} />
          )}
          
          {item.type === 6 && renderFileInfo(item.content)}
          
          {item.type === 4 && (
            <PdfsClipboard item={item} color={typeInfo.color} />
          )}

          {item.type === 5 && <VideosClipboard item={item} />}
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.timestampText}>Just now</Text>
          <View style={styles.cardFooterActions}>
            {item.type === 3 && (
              <TouchableOpacity
                style={styles.miniButton}
                onPress={() => Linking.openURL(item.content)}
              >
                <Icon name="open-outline" size={14} color="#F59E0B" />
                <Text style={styles.miniButtonText}>Open</Text>
              </TouchableOpacity>
            )}
            {[1, 3].includes(item.type) && (
              <TouchableOpacity
                style={styles.miniButton}
                onPress={() => handleContentPress(item)}
              >
                <Icon name="copy-outline" size={14} color="#F59E0B" />
                <Text style={styles.miniButtonText}>Copy</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
      <Icon name="menu" size={26} color="#FFFFFF" />
    </TouchableOpacity>
  );

  const openSubMenu = () => {
    setOpenSubMenuTab(!openSubMenuTab);
  };

  const filteredLogs = logs.filter((item) => type === item.type);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isOpen && <Sidebar />}

        {/* Header with Gradient */}
        <LinearGradient
          colors={['#111827', '#1F2937']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            {BackAction()}
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>ClipWave</Text>
              <View style={styles.accentDot} />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={openSubMenu}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.addButtonGradient}
              >
                <Icon name="add" size={24} color="#000" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Icon name="layers-outline" size={18} color="#F59E0B" />
              <Text style={styles.statText}>{filteredLogs.length} Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="time-outline" size={18} color="#F59E0B" />
              <Text style={styles.statText}>Recent</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content Area */}
        <TouchableWithoutFeedback onPress={() => dispatch(closeNav())}>
          <View style={styles.contentContainer}>
            {/* Welcome Section */}
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>My Clipboard</Text>
                <Text style={styles.welcomeSubtext}>
                  {filteredLogs.length} {filteredLogs.length === 1 ? 'item' : 'items'} stored
                </Text>
              </View>
              {filteredLogs.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
                  <Icon name="trash-outline" size={16} color="#EF4444" />
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Content Cards */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {filteredLogs.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <LinearGradient
                      colors={['rgba(245, 158, 11, 0.2)', 'rgba(217, 119, 6, 0.1)']}
                      style={styles.emptyIconGradient}
                    >
                      <Icon name="clipboard-outline" size={64} color="#F59E0B" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.emptyTitle}>No items yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Tap + to start sharing content
                  </Text>
                </View>
              ) : (
                filteredLogs.map((item, i) => renderClipboardCard(item, i))
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {openSubMenuTab && (
        <FilePickerModal
          visible={openSubMenuTab}
          onClose={() => setOpenSubMenuTab(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
  },
  addButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F2937",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#374151",
    marginHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  typeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    marginBottom: 12,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#111827",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  fileUrl: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  timestampText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  cardFooterActions: {
    flexDirection: "row",
    gap: 8,
  },
  miniButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  miniButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F59E0B",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default HomeScreen2;