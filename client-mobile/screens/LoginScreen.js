import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const onLoginPress = async () => {
    if (email && password) {
      console.log("Signed Up with email:", email);

      try {
        const response = await fetch(
          // "http://192.168.1.14:3000/api/auth/login",
          "http://192.168.1.15:3000/api/auth/login",
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
          return;
        }

        const data = await response.json();
        if (data.code === 200) {
          await AsyncStorage.setItem("token", data.token);
          console.log("Token:", data.token);
          navigation.navigate("Home");
        }
      } catch (err) {
        console.log("Error:", err);
      }
    } else {
      console.log("Please fill in all fields");
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Floating Elements Background */}
      <View style={styles.floatingElements}>
        <View style={[styles.floatingCircle, styles.circle1]} />
        <View style={[styles.floatingCircle, styles.circle2]} />
        <View style={[styles.floatingCircle, styles.circle3]} />
      </View>

      <View style={styles.content}>
        {/* Logo/Brand Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>📋</Text>
          </View>
          <Text style={styles.brandName}>ClipWave</Text>
          <Text style={styles.brandTagline}>Share instantly, connect seamlessly</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputWrapperFocused
            ]}>
              <TextInput
                value={email}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputWrapper,
              passwordFocused && styles.inputWrapperFocused
            ]}>
              <TextInput
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerQuestion}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.footerLink}>Create Account</Text>
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
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 120,
    height: 120,
    top: height * 0.1,
    right: -40,
  },
  circle2: {
    width: 80,
    height: 80,
    top: height * 0.3,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: height * 0.2,
    right: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 40,
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  brandTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputWrapperFocused: {
    borderColor: '#667eea',
    backgroundColor: '#FFFFFF',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerQuestion: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginRight: 8,
  },
  footerLink: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;