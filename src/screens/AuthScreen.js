import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getUserData } from '../data/UserDataManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const initializeRememberedData = async () => {
      const rememberedEmail = await AsyncStorage.getItem('rememberedEmail');
      const rememberedPassword = await AsyncStorage.getItem('rememberedPassword');
      if (rememberedEmail && rememberedPassword) {
        setEmail(rememberedEmail);
        setPassword(rememberedPassword);
      }
    };
    initializeRememberedData();
  }, []);

  const handleLogin = async () => {
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    // Validate password
    if (!password || password.trim() === '') {
      setPasswordError('Password is required');
      return;
    }

    const userData = await getUserData();
    const user = userData.find(
      (u) => u.email.trim() === email.trim() && u.password === password
    );

    if (user) {
      console.log('Login successful');
      navigation.navigate('Main', { email });
    } else {
      console.log('Login failed. Invalid email or password.');
      setEmailError('');
      setPasswordError('Invalid email or password');
    }
  };

  // Email validation function
  const validateEmail = (email) => {
    return email.includes('@');
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      <Text style={styles.header}>Welcome to Project Management</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError('');
        }}
      />
      {emailError ? (
        <Text style={styles.errorText}>{emailError}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError('');
        }}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF', // Changed text color to blue
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: '#007BFF', // Changed button color to blue
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20, // Increased button padding
    marginTop: 20, // Added margin to separate the button from inputs
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10, // Added margin to separate error messages
  },
});

export default AuthScreen;
