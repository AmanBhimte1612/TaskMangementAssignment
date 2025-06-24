import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { images } from '@/constants';
import CustomTextInput from '@/components/CustomTextInput';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { loginWithEmail } from '@/components/loginWithEmail';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const uid = await loginWithEmail(email, password);
      Alert.alert('Login successful!', `User ID: ${uid}`);
      router.replace('/(tabs)/Tasks');
    } catch (error: any) {
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          keyboardShouldPersistTaps="handled"
          className="bg-white"
        >
          {/* Top Content */}
          <View className="items-center pt-10">
            <Image source={images.onboarding} className="w-full h-[230px]" />
            <Text className="text-3xl text-purple-700 font-bold px-10 mb-8 text-center">
              Welcome back!
            </Text>

            <View className="w-full items-center">
              <CustomTextInput
                placeholder="Email Address"
                label="Email Address"
                keyboardType="email-address"
                value={email}
                onChangeText={(value: string) => setEmail(value)}
              />
              <CustomTextInput
                placeholder="Password"
                label="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(val: string) => setPassword(val)}
              />
            </View>

            <View className="items-center justify-center mt-8">
              <CustomButton
                title="Log In"
                className="w-[180px]"
                titleStyle="text-2xl"
                onPress={handleLogin}
              />
            </View>
          </View>

          {/* Bottom Link */}
          <View className="items-center mb-10">
            <Text className="text-center text-gray-400">
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => router.push('/(auth)/SignUp')}>
                <Text className="text-purple-700 font-semibold">Get started!</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
