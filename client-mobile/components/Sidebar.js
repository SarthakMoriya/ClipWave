import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, List, ListItem, Icon } from "@ui-kitten/components";
import { useDispatch } from "react-redux";
import { setType } from "../store/clipboard";

const data = [
  { title: "Text", icon: "file-outline", type: 1 },
  { title: "Images", icon: "image-outline", type: 2 },
  { title: "Links", icon: "link-outline", type: 3 },
  { title: "PDFs", icon: "file-text-outline", type: 4 },
  { title: "Videos", icon: "video-outline", type: 5 },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      accessoryLeft={(props) => <Icon {...props} name={item.icon} />}
      onPress={() => {
        dispatch(setType(item.type));
      }}
    />
  );

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.title}>
        Clipboard Types
      </Text>
      <List data={data} renderItem={renderItem} style={styles.list} />
    </Layout>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    backgroundColor: "transparent",
  },
});
