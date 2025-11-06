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
import { Button } from "react-native";
import styles from "../styles/HomeScreen2.styles";
import VideosClipboard from "./VideosClipboard";
import PdfsClipboard from "./PdfsClipboard";
import TextClipboard from "./TextClipboard";
import ImagesClipboard from "./ImagesClipboard";
import FilePickerModal from "./FilePickerModal";

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

  // Clear logs of currentl type selected
  const clearLogs = () => {
    dispatch(removeLogs({ type: type }));
  };

  const renderClipboardCard = (item, i) => {
    const typeInfo = getContentTypeInfo(item.type);
    console.log(`TYPE::${typeInfo}`);
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
              <TextClipboard numberOfLines={4} content={item.content} />
            )}

            {(item.type === 2 || item.type === 7) && (
              <ImagesClipboard item={item} />
            )}
            {item.type === 6 && renderFileInfo(item.content)}
            {item.type === 4 && (
              <PdfsClipboard item={item} color={typeInfo.color} />
            )}

            {/* VIDEOS */}
            {item.type === 5 && <VideosClipboard item={item} />}
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
              {[1, 3].includes(item.type) && (
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
              )}
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

  const openSubMenu = () => {
    console.log("hr");
    setOpenSubMenuTab(!openSubMenuTab);
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
          <TouchableOpacity style={styles.addButton} onPress={openSubMenu}>
            <Icon name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <TouchableWithoutFeedback onPress={() => dispatch(closeNav())}>
          <View style={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              {/* Welcome Section */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome back! 👋</Text>
                <Text style={styles.welcomeSubtext}>
                  {filteredLogs.length} items ready to share
                </Text>
              </View>
              <View style={styles.deleteButton}>
                <Button title="Clear" onPress={clearLogs} color="#007AFF" />
              </View>
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
      {openSubMenuTab && (
        <FilePickerModal
          visible={openSubMenuTab}
          onClose={() => setOpenSubMenuTab(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen2;
