import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Layout, Input, Button, Text } from "@ui-kitten/components";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle signup logic
  const onSignupPress = async () => {
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        // Simulate signup success
        console.log("Signed Up with email:", email);
        
        try {
          const response = await fetch("http://192.168.1.16:3000/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type
            },
            body: JSON.stringify({ email, password }), // Use JSON.stringify() to convert object to string
          });
  
          if (!response.ok) {
            // If response is not successful (e.g., 404, 500)
            const errorText = await response.text(); // Read as plain text to log or handle
            console.log('Error Response:', errorText);
            return;
          }
  
          // Try to parse JSON response
          const data = await response.json();
          console.log('Signup successful:', data);
  
          // Navigate to Home or handle further logic after successful signup
          // navigation.navigate("Home"); // Uncomment this if you want to navigate
  
        } catch (err) {
          // Handle errors that are not related to the response format
          console.log('Error:', err);
        }
      } else {
        console.log("Passwords do not match");
      }
    } else {
      console.log("Please fill in all fields");
    }
  };
  
  
  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Text category="h1" style={styles.title}>
          Sign Up
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
        <Input
          value={confirmPassword}
          label="Confirm Password"
          placeholder="Confirm your password"
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button onPress={onSignupPress} style={styles.button}>
          Sign Up
        </Button>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerText}>Already have an account? Login</Text>
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

export default SignupScreen;
