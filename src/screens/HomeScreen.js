import * as React from 'react';
import { View, Text, Image, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const themeColors = {
  bg: '#9DB5B2',
  
};

function HomeScreen() {
  const navigation = useNavigation();
  const isLoggedIn = true;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <View style={{ flex: 1, justifyContent: 'space-around', marginVertical: 4 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 32, textAlign: 'center' }}>
          {isLoggedIn ? 'Welcome Back!' : "Let's Get Started!"}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Image
            source={require('../../assets/welcome.png')}
            style={{ width: 350, height: 350 }}
          />
        </View>

        {isLoggedIn && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Auth')}
            style={{
              padding: 12,
              backgroundColor: '#FFD700',
              marginHorizontal: 7,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#7A7A7A',
              }}
            >
              Go to Login
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
