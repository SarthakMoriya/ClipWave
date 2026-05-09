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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const ForgotPasswordScreen = ({ navigation }) => {
  const ip = useSelector((state) => state.extra.ip);
  
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Code + Password
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://${ip}:3000/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.message);
        // For testing/debug, we can auto-fill the token if provided
        if (data.debug_token) {
          console.log("Debug Reset Token:", data.debug_token);
        }
        setStep(2);
      } else {
        Alert.alert("Error", data.message || "Failed to send reset code");
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please check your connection.");
    }
  };

  const onResetPassword = async () => {
    if (!token || !newPassword) {
      Alert.alert("Error", "Please enter the reset code and your new password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://${ip}:3000/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", "Password reset successfully! You can now login.", [
          { text: "Go to Login", onPress: () => navigation.navigate("Login") }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to reset password");
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please check your connection.");
    }
  };

  return (
    <LinearGradient colors={["#FFB300", "#FF9800", "#F57C00"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Text style={styles.backIcon}>⬅️</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reset Password</Text>
              </View>

              <View style={styles.content}>
                <View style={styles.iconContainer}>
                  <Text style={styles.lockIcon}>{step === 1 ? "📧" : "🔐"}</Text>
                </View>

                <View style={styles.formCard}>
                  <Text style={styles.formSubtitle}>
                    {step === 1 
                      ? "Enter your registered email address to receive a 6-digit reset code."
                      : "Enter the code sent to your email and create a new password."}
                  </Text>

                  {step === 1 ? (
                    /* STEP 1: EMAIL */
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Email Address</Text>
                      <View style={[styles.inputWrapper, focusedField === "email" && styles.inputFocused]}>
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
                      
                      <TouchableOpacity 
                        style={styles.mainButton} 
                        onPress={onSendCode}
                        disabled={loading}
                      >
                        <LinearGradient
                          colors={["#FFB300", "#FF8F00"]}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Reset Code"}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    /* STEP 2: CODE & NEW PASSWORD */
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>6-Digit Code</Text>
                      <View style={[styles.inputWrapper, focusedField === "token" && styles.inputFocused]}>
                        <TextInput
                          placeholder="Enter reset code"
                          placeholderTextColor="#9CA3AF"
                          value={token}
                          onChangeText={setToken}
                          keyboardType="number-pad"
                          maxLength={6}
                          style={styles.input}
                          onFocus={() => setFocusedField("token")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>

                      <Text style={[styles.label, { marginTop: 16 }]}>New Password</Text>
                      <View style={[styles.inputWrapper, focusedField === "password" && styles.inputFocused]}>
                        <TextInput
                          placeholder="Enter new password"
                          placeholderTextColor="#9CA3AF"
                          value={newPassword}
                          onChangeText={setNewPassword}
                          secureTextEntry
                          style={styles.input}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>

                      <TouchableOpacity 
                        style={styles.mainButton} 
                        onPress={onResetPassword}
                        disabled={loading}
                      >
                        <LinearGradient
                          colors={["#FFB300", "#FF8F00"]}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.buttonText}>{loading ? "Resetting..." : "Reset Password"}</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setStep(1)} style={styles.retryButton}>
                        <Text style={styles.retryText}>Didn't receive code? Try again</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  backIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    paddingTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  lockIcon: {
    fontSize: 50,
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 28,
    padding: 25,
    width: "100%",
    elevation: 4,
  },
  formSubtitle: {
    fontSize: 15,
    color: "#5D4037",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5D4037",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFE0B2",
    paddingHorizontal: 16,
    height: 55,
    justifyContent: "center",
  },
  inputFocused: {
    borderColor: "#FFA000",
    backgroundColor: "#FFFFFF",
  },
  input: {
    fontSize: 16,
    color: "#3E2723",
    height: "100%",
  },
  mainButton: {
    marginTop: 25,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  retryButton: {
    marginTop: 20,
    alignItems: "center",
  },
  retryText: {
    color: "#F57C00",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;
