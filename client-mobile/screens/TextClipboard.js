import {  Text } from "react-native";
import styles from "../styles/HomeScreen2.styles";

const TextClipboard = ({ numberOfLines, content }) => {
  return (
    <Text style={styles.textContent} numberOfLines={numberOfLines}>
      {content}
    </Text>
  );
};

export default TextClipboard;
