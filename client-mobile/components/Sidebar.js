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
  { title: "All", icon: "apps-outline", type: 0, color: "#F59E0B" },
  { title: "Text", icon: "document-text-outline", type: 1, color: "#60A5FA" },
  { title: "Images", icon: "image-outline", type: 2, color: "#F97316" },
  { title: "Links", icon: "link-outline", type: 3, color: "#10B981" },
  { title: "PDFs", icon: "document-outline", type: 4, color: "#EF4444" },
  { title: "Videos", icon: "videocam-outline", type: 5, color: "#8B5CF6" },
  { title: "APKs", icon: "download-outline", type: 6, color: "#14B8A6" },
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
      style={[styles.listItem, { backgroundColor: item.color + "22" }]}
      onPress={() => handlePress(item.type)}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "33" }]}
      >
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <Text style={styles.itemText}>{item.title}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={16}
        color="#9CA3AF"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerIcon}>
          <Ionicons name="clipboard-outline" size={24} color="#F59E0B" />
        </View>
        <View>
          <Text style={styles.title}>Clipboard Manager</Text>
          <Text style={styles.subtitle}>Choose content type</Text>
        </View>
      </View>
    </View>
  );

  const handleSignOut = () => console.log("User signed out");

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.helpButton}>
        <Ionicons name="help-circle-outline" size={20} color="#9CA3AF" />
        <Text style={styles.helpText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />
      {/* Close Button */}
      <View style={styles.closeContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
    backgroundColor: "#0F172A",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    height: "100%",
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  closeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
  },
  closeButton: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    padding: 8,
    elevation: 4,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    backgroundColor: "#111827",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(245,158,11,0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
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
    fontSize: 15,
    color: "#E5E7EB",
    fontWeight: "500",
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
  footer: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#1F2937",
    borderRadius: 8,
    marginBottom: 8,
  },
  settingsText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginLeft: 10,
    fontWeight: "500",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginLeft: 10,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  signOutText: {
    fontSize: 14,
    color: "#EF4444",
    marginLeft: 10,
    fontWeight: "600",
  },
});
