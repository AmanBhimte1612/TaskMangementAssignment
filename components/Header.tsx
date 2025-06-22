import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';

type Props={
    headerTitle: string
}

const Header = ({headerTitle}: Props) => {
    return (
         <View className="items-center z-50 justify-center relative bg-purple-600 w-full h-48">
                <View
                    className="bg-purple-500 w-[150px] h-[150px] rounded-full absolute justify-center items-center"
                    style={{
                        bottom: -30,
                        left: -20,
                    }}
                />
                <View className="flex-row justify-between items-center px-4 py-2 gap-4">
                    {/* Left Icon */}
                    <TouchableOpacity className="bg-purple-500 w-[35px] h-[35px] rounded-full justify-center items-center">
                        <Octicons name="apps" size={38} color="white" />
                    </TouchableOpacity>

                    {/* Search Bar */}
                    <View className="relative w-[230px] h-[35px] justify-center">
                        <TextInput
                            className="bg-white w-full h-full rounded-full pl-10 pr-3 text-sm text-gray-800"
                            // placeholder="Search"
                            placeholderTextColor="#9ca3af"
                        />
                        <FontAwesome
                            name="search"
                            size={16}
                            color="#9ca3af"
                            style={{ position: 'absolute', left: 10 }}
                        />
                    </View>

                    {/* Right Icon */}
                    <TouchableOpacity className="bg-purple-500 w-[50px] h-[50px] rounded-full justify-center items-center">
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className='absolute bottom-1 left-4 px-2 '>
                    <Text className="text-[14px]  text-purple-100 font-bold">Today, 1 May</Text>
                    <Text className="text-[20px]  text-purple-50 font-bold">{headerTitle}</Text>
                </View>

            </View>
    )
}

export default Header