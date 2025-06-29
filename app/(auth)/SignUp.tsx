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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import Loading from '@/components/Loading';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [loading,setLoading]=useState(false)
  
  const handleSignUp = async () => {
    setLoading(true)
    if (!email || !password) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'Users', userId), {
        email,
        password, 
        tasks: [],
      });

      router.replace('/(auth)/Login');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Sign Up Failed', error.message);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
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
              Let's get started!
            </Text>

            <View className="w-full items-center">
              <CustomTextInput
                placeholder="Email Address"
                label="Email Address"
                keyboardType="email-address"
                value={email}
                onChangeText={(value) => setEmail(value)}
              />
              <CustomTextInput
                placeholder="Password"
                label="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(value) => setPassword(value)}
              />
            </View>

            <View className="items-center justify-center mt-8">
              <CustomButton
                title="Sign Up"
                className="w-[180px]"
                titleStyle="text-2xl"
                onPress={handleSignUp}
              />
            </View>
          </View>

          {/* Bottom Link */}
          <View className="items-center mb-10">
            <Text className="text-center text-gray-400">
              Already have an account?{' '}
              <TouchableOpacity onPress={() => router.push('/(auth)/Login')}>
                <Text className="text-purple-700 font-semibold">Log in</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
