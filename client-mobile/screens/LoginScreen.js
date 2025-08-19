import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test");

  const onLoginPress = async () => {
    if (email && password) {
      console.log("Signed Up with email:", email);

      try {
        const response = await fetch(
          "http://192.168.1.16:3000/api/auth/login",
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          placeholder="Enter your email"
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          placeholder="Enter your password"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button title="Login" onPress={onLoginPress} color="#3366FF" />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.footerText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#444",
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
