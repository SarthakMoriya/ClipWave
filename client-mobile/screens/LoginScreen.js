import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Dimensions,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const ip = useSelector((state) => state.extra.ip);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const onLoginPress = async () => {
    try {
      console.log('hiiiiiiiii')
      console.log(`IP IS :${ip}`);
      if (email && password) {
        try {
          const response = await axios.post(`http://${ip}:3000/api/auth/login`, {
            email,
            password
          });

          console.log("Login response:", response.data);

          if (response.data.code === 200) {
            Alert.alert("Success", response.data.message || "Login successful");
            await AsyncStorage.setItem("token", response.data.token);
            navigation.navigate("Home");
          }
        } catch (err) {
          console.log("Login Error:", err.response?.data || err.message);
          if (err.response && err.response.data && err.response.data.message) {
            Alert.alert("Login Failed", err.response.data.message);
          } else {
            Alert.alert("Error", "An error occurred during login. Please try again.");
          }
        }
      } else {
        console.log("Please fill in all fields");
        Alert.alert("Required Fields", "Please fill in both email and password.");
      }
    } catch (error) {
      console.log("Unexpected error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <LinearGradient colors={["#FFB75E", "#ED8F03"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
        >
          {/* Background - PointerEvents="none" ensures it doesn't block taps */}
          <View style={styles.floatingBackground} pointerEvents="none">
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>

          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoBox}>
                <Text style={styles.logoEmoji}>📋</Text>
              </View>
              <Text style={styles.appName}>ClipWave</Text>
              <Text style={styles.tagline}>
                Share instantly, connect seamlessly
              </Text>
            </View>

            {/* Login Card */}
            <View style={styles.formCard}>
              <Text style={styles.heading}>Welcome Back 👋</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "email" && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "password" && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={onLoginPress}
              >
                <LinearGradient
                  colors={["#FFB75E", "#ED8F03"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.footerLink}> Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  floatingBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  circle: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circle1: {
    width: 140,
    height: 140,
    top: height * 0.08,
    right: -40,
  },
  circle2: {
    width: 100,
    height: 100,
    top: height * 0.35,
    left: -30,
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: height * 0.15,
    right: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 60,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  tagline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#3E2723",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5D4037",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FFECB3",
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
  },
  inputFocused: {
    borderColor: "#FFB75E",
    backgroundColor: "#FFFFFF",
  },
  input: {
    fontSize: 16,
    color: "#3E2723",
    height: "100%",
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    color: "#A1887F",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },
  footerLink: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
