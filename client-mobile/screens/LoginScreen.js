import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Layout, Input, Button, Text, Icon } from "@ui-kitten/components";

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login logic
  const onLoginPress = () => {
    // Your login logic here
    console.log("Email:", email, "Password:", password);
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
        <TouchableOpacity onPress={() => {navigation.navigate('Signup')}}>
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
