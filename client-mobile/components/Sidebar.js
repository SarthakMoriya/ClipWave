import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { setType } from "../store/clipboard";
import { closeNav } from "../store/states";

const data = [
  { title: "Text", icon: "document-outline", type: 1 },
  { title: "Images", icon: "image-outline", type: 2 },
  { title: "Links", icon: "link-outline", type: 3 },
  { title: "PDFs", icon: "document-text-outline", type: 4 },
  { title: "Videos", icon: "videocam-outline", type: 5 },
  { title: "APk", icon: "document-outline", type: 6 },
];

const Sidebar = () => {
  const dispatch = useDispatch();

  const handlePress = (type) => {
    dispatch(setType(type));
    dispatch(closeNav());
  };

  const renderItem = ({ item }) => (
    <>
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => handlePress(item.type)}
      >
        <Ionicons name={item.icon} size={22} color="#333" style={styles.icon} />
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clipboard Types</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.type.toString()}
      />
    </View>
  );
};

export default Sidebar;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    height: "100%",
    width: 250,
    borderRightWidth: 1,
    borderColor: "#eaeaea",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eaeaea",
    marginVertical: 4,
  },
});
