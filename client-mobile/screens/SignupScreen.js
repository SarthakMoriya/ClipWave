import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Button,
  Alert,
} from "react-native";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSignupPress = async () => {
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        console.log("Signing up with email:", email);

        try {
          const response = await fetch("http://192.168.29.22:3000/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          style={styles.input}
        />

        <Button title="Sign Up" onPress={onSignupPress} color="#3366FF" />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
