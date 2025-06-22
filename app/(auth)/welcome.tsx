import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { images } from '@/constants';
import { router } from 'expo-router';
// import { ArrowRight } from 'lucide-react-native'; // or use an Image if this is a custom icon
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
const Welcome = () => {
  return (
    <SafeAreaView className="flex-1 relative bg-white pt-32">
      <Image source={images.onboarding} className="w-full h-[300px]" />

      <Text className="text-3xl text-purple-700 font-bold px-10">Get things done.</Text>
      <Text className="text-2xl text-gray-300 font-bold px-10">
        Just a click away from planning your tasks
      </Text>

      <TouchableOpacity
        className="bg-purple-300 w-[300px] h-[300px] rounded-full absolute justify-center items-center"
        style={{
          bottom: -100,
          right: -100,
        }}
        onPress={() => {
          router.push('/(auth)/Login');
        }}
      >
        <Feather name="arrow-right" size={100} color="white" className='mb-20 mr-10' />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Welcome;
