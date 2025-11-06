import { StyleSheet, Text, View } from "react-native";
import { Video } from "expo-av";

const VideosClipboard = ({item}) => {
  return (
    <View style={styles.mediaContainer}>
      <Video
        source={{ uri: item.content.url }}
        useNativeControls
        resizeMode="contain"
        style={styles.videoPlayer}
      />
      <Text style={styles.mediaText}>{item.content.name}</Text>
    </View>
  );
};

export default VideosClipboard;

const styles = StyleSheet.create({
  videoPlayer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#000",
    marginTop: 8,
  },
});
