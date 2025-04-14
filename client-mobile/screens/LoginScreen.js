import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Layout, Input, Button, Text, Icon } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test");

  // Handle login logic
  const onLoginPress = async () => {
    if (email && password) {
      // Simulate signup success
      console.log("Signed Up with email:", email);

      try {
        const response = await fetch(
          "http://192.168.29.22:3000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type
            },
            body: JSON.stringify({ email, password }), // Use JSON.stringify() to convert object to string
          }
        );

        if (!response.ok) {
          // If response is not successful (e.g., 404, 500)
          const errorText = await response.text(); // Read as plain text to log or handle
          console.log("Error Response:", errorText);
          return;
        }

        // Try to parse JSON response
        const data = await response.json();
        if (data.code === 200) {
          await AsyncStorage.setItem("token", data.token);
          console.log("Token:", data.token);

          navigation.navigate("Home");
        }
      } catch (err) {
        // Handle errors that are not related to the response format
        console.log("Error:", err);
      }
    } else {
      console.log("Please fill in all fields");
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Text category="h1" style={styles.title}>
          Login
        </Text>
      </View>
      <View style={styles.formContainer}>
        <Input
          value={email}
          label="Email"
          placeholder="Enter your email"
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <Input
          value={password}
          label="Password"
          placeholder="Enter your password"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button onPress={onLoginPress} style={styles.button}>
          Login
        </Button>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          <Text style={styles.footerText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

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
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3366FF",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#007AFF",
  },
});

export default LoginScreen;
