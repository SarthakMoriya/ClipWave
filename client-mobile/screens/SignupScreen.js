import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Alert,
  Dimensions,
  SafeAreaView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const ip=useSelector((state) => state.extra.ip);  

  const onSignupPress = async () => {
    if (name && email && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          const response = await fetch(
            `http://${ip}:3000/api/auth/signup`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password }),
            },
          );

          const data = await response.json();

          if (!response.ok) {
            Alert.alert("Signup Failed", data.message || "Server error.");
            return;
          }

          Alert.alert(
            "Success",
            data.message || "Account created successfully!",
          );
          navigation.navigate("Login");
        } catch (err) {
          Alert.alert(
            "Error",
            "Something went wrong. Please check your connection.",
          );
        }
      } else {
        Alert.alert("Error", "Passwords do not match");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  return (
    <LinearGradient
      colors={["#FFB300", "#FF9800", "#F57C00"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
        >
          {/* Background - PointerEvents="none" ensures it doesn't block taps */}
          <View style={styles.floatingElements} pointerEvents="none">
            <View style={[styles.floatingShape, styles.shape1]} />
            <View style={[styles.floatingShape, styles.shape2]} />
            <View style={[styles.floatingShape, styles.shape3]} />
            <View style={[styles.floatingShape, styles.shape4]} />
          </View>

          <View style={styles.content}>
            {/* Header */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>⚡</Text>
              </View>
              <Text style={styles.brandName}>Join ClipWave</Text>
              <Text style={styles.brandTagline}>Share files seamlessly</Text>
            </View>

            {/* Signup Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Create Account</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "name" && styles.inputFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "email" && styles.inputFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "password" && styles.inputFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    style={styles.input}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "confirm" && styles.inputFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>🔐</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    style={styles.input}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={onSignupPress}
              >
                <LinearGradient
                  colors={["#FFB300", "#FF8F00"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerQuestion}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  floatingElements: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  floatingShape: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  shape1: {
    width: 100,
    height: 100,
    borderRadius: 20,
    top: height * 0.15,
    right: -30,
    transform: [{ rotate: "45deg" }],
  },
  shape2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    top: height * 0.25,
    left: -15,
  },
  shape3: {
    width: 40,
    height: 40,
    borderRadius: 8,
    bottom: height * 0.3,
    right: 30,
    transform: [{ rotate: "30deg" }],
  },
  shape4: {
    width: 80,
    height: 80,
    borderRadius: 16,
    bottom: height * 0.15,
    left: 20,
    transform: [{ rotate: "-15deg" }],
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  logoText: {
    fontSize: 40,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF8E1",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 16,
    color: "#FFF3E0",
    textAlign: "center",
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 28,
    padding: 25,
    elevation: 4,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3E2723",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5D4037",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFE0B2",
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
  },
  inputFocused: {
    borderColor: "#FFA000",
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#3E2723",
    height: "100%",
  },
  signupButton: {
    marginTop: 10,
    borderRadius: 16,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 20,
  },
  footerQuestion: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    marginRight: 8,
  },
  footerLink: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default SignupScreen;
