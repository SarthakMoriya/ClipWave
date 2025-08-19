import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { setType } from "../store/clipboard";
import { closeNav } from "../store/states";

const data = [
  { title: "All", icon: "apps-outline", type: 0, color: "#34495E" }, // new option
  { title: "Text", icon: "document-text-outline", type: 1, color: "#4A90E2" },
  { title: "Images", icon: "image-outline", type: 2, color: "#F39C12" },
  { title: "Links", icon: "link-outline", type: 3, color: "#27AE60" },
  { title: "PDFs", icon: "document-outline", type: 4, color: "#E74C3C" },
  { title: "Videos", icon: "videocam-outline", type: 5, color: "#9B59B6" },
  { title: "APKs", icon: "download-outline", type: 6, color: "#1ABC9C" },
];

const Sidebar = () => {
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeNav());
  };

  const handlePress = (type) => {
    dispatch(setType(type));
    dispatch(closeNav());
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor: item.color + "10" }]}
      onPress={() => handlePress(item.type)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={20} color="white" />
      </View>
      <Text style={styles.itemText}>{item.title}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={16}
        color="#999"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerIcon}>
          <Ionicons name="clipboard-outline" size={24} color="#4A90E2" />
        </View>
        <View>
          <Text style={styles.title}>Clipboard Manager</Text>
          <Text style={styles.subtitle}>Choose content type</Text>
        </View>
      </View>
    </View>
  );

  const handleSignOut = () => {
    console.log("User signed out");
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={20} color="#666" />
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.helpButton}>
        <Ionicons name="help-circle-outline" size={20} color="#666" />
        <Text style={styles.helpText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      {/* Close Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 1,
          backgroundColor:'#ffffff'
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: "#e63946", // red shade
            borderRadius: 12,
            padding: 8,
            elevation: 3, // shadow for Android
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          }}
        >
          <Ionicons name="close" size={22} color="white" />
        </TouchableOpacity>
      </View>
      {renderHeader()}

      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.type.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {renderFooter()}
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    height: "100%",
    width: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#4A90E2" + "15",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#7f8c8d",
    fontWeight: "400",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  listContent: {
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
  footer: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  settingsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    fontWeight: "500",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  signOutText: {
    fontSize: 14,
    color: "#E74C3C",
    marginLeft: 12,
    fontWeight: "600",
  },
});
