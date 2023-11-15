import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Switch, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUserData } from '../data/UserDataManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themeColors = {
  bg: '#9DB5B2',
};

function AuthScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const handleRememberMeToggle = () => {
    setRememberMe((prevRememberMe) => !prevRememberMe);
  };

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
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }
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
      navigation.navigate('Main', { email: email});

      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
      }
    } else {
      console.log('Login failed. Invalid email or password.');
      setEmailError('');
      setPasswordError('Invalid email or password');
    }
  };
  const validateEmail = (email) => {
    return email.includes('@');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'start' }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#FFD700',
                padding: 10,
                borderRadius: 20,
                marginLeft: 20,
              }}
            >
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image
              source={require('../../assets/login.png')}
              style={{ width: 200, height: 200 }}
            />
          </View>
        </SafeAreaView>
        <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'gray', marginLeft: 20 }}>Email Address</Text>
            <TextInput
              style={{
                padding: 10,
                backgroundColor: '#F0F0F0',
                color: 'gray',
                borderRadius: 10,
                marginBottom: 10,
              }}
              placeholder="email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
            />
            {emailError ? <Text style={{ color: 'red', marginLeft: 20 }}>{emailError}</Text> : null}
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'gray', marginLeft: 20 }}>Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: '#F0F0F0',
                  color: 'gray',
                  borderRadius: 10,
                }}
                secureTextEntry={!showPassword}
                placeholder="password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                  style={{ padding: 10 }}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={{ color: 'red', marginLeft: 20 }}>{passwordError}</Text> : null}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: 'gray', marginLeft: 20 }}>Remember Me</Text>
            <Switch
              value={rememberMe}
              onValueChange={handleRememberMeToggle}
              style={{ marginLeft: 'auto', marginRight: 20 }}
            />
          </View>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: '#FFD700',
              borderRadius: 10,
            }}
            onPress={handleLogin}
          >
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'gray',
            }}>
              Login
            </Text>
          </TouchableOpacity>
          <Text style={{
            fontSize: 20,
            color: 'gray',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: 30,
          }}/>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default AuthScreen;
