import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const onSignupPress = async () => {
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        console.log("Signing up with email:", email);

        try {
          const response = await fetch(
            "http://192.168.1.14:3000/api/auth/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.log("Error Response:", errorText);
            Alert.alert("Signup Failed", errorText || "Server error.");
            return;
          }

          const data = await response.json();
          console.log("Signup successful:", data);
          Alert.alert("Success", "Account created successfully!");

          // navigation.navigate("Home"); // Uncomment if needed
        } catch (err) {
          console.log("Error:", err);
          Alert.alert("Error", "Something went wrong.");
        }
      } else {
        Alert.alert("Error", "Passwords do not match");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      {/* Floating Elements Background */}
      <View style={styles.floatingElements}>
        <View style={[styles.floatingShape, styles.shape1]} />
        <View style={[styles.floatingShape, styles.shape2]} />
        <View style={[styles.floatingShape, styles.shape3]} />
        <View style={[styles.floatingShape, styles.shape4]} />
      </View>

      <View style={styles.content}>
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🌊</Text>
          </View>
          <Text style={styles.brandName}>Join ClipWave</Text>
          <Text style={styles.brandTagline}>
            Start sharing files effortlessly
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                emailFocused && styles.inputWrapperFocused,
              ]}
            >
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                style={styles.input}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputWrapperFocused,
              ]}
            >
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                style={styles.input}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.inputWrapper,
                confirmPasswordFocused && styles.inputWrapperFocused,
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
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={onSignupPress}>
            <LinearGradient
              colors={["#ff6b6b", "#ffa726"]}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingElements: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoText: {
    fontSize: 45,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandTagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 28,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputWrapperFocused: {
    borderColor: "#4facfe",
    backgroundColor: "#FFFFFF",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    paddingVertical: 14,
  },
  signupButton: {
    marginTop: 12,
    borderRadius: 16,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
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
    marginTop: 32,
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
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default SignupScreen;
