import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const HelpSupportScreen = () => {
  const navigation = useNavigation();

  const handleContactDeveloper = () => {
    Linking.openURL("mailto:developer@clipwave.com");
  };

  const supportItems = [
    {
      id: 1,
      title: "Contact Developer",
      description: "Get in touch for custom features or bug reports.",
      icon: "mail-outline",
      color: "#60A5FA",
      action: handleContactDeveloper,
    },
    {
      id: 2,
      title: "FAQs",
      description: "Frequently asked questions about ClipWave.",
      icon: "help-circle-outline",
      color: "#F59E0B",
    },
    {
      id: 3,
      title: "App Tutorial",
      description: "Learn how to use all features of ClipWave.",
      icon: "book-outline",
      color: "#10B981",
    },
    {
      id: 4,
      title: "Privacy Policy",
      description: "How we handle your data and security.",
      icon: "shield-checkmark-outline",
      color: "#8B5CF6",
    },
    {
      id: 5,
      title: "Terms of Service",
      description: "Legal terms for using ClipWave.",
      icon: "document-text-outline",
      color: "#EF4444",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.iconWrapper}>
            <Ionicons name="chatbubbles-outline" size={40} color="#F59E0B" />
          </View>
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeSubtitle}>
            We're here to assist you with any issues or questions you might have
            about ClipWave.
          </Text>
        </View>

        {/* Support Options */}
        <View style={styles.optionsContainer}>
          {supportItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionCard}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionIconContainer,
                  { backgroundColor: `${item.color}22` },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Developer Info Section */}
        <View style={styles.devSection}>
          <Text style={styles.devTitle}>ClipWave v1.0.0</Text>
          <Text style={styles.devText}>
            Built with ❤️ by the Sarthak Moriya
          </Text>
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={handleContactDeveloper}
          >
            <Text style={styles.contactBtnText}>Contact Developer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#111827",
  },
  backButton: {
    padding: 8,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#111827",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(245,158,11,0.1)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  devSection: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  devTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  devText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  contactBtn: {
    backgroundColor: "#60A5FA",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  contactBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
