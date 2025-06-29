import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';

type Props = {
    placeholder?: string;
    label: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    secureTextEntry?: boolean;
    value?:string;
    onChangeText: any;
};

const CustomTextInput = ({
    placeholder,
    label,
    keyboardType = 'default',
    secureTextEntry = false,
    value,
    onChangeText,

    ...props
}: Props) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full items-center"
            
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="mb-4 relative">
                    <Text className="ml-8 mb-2 text-gray-400 font-medium">{label}</Text>

                    <TextInput
                        className="border border-gray-300 w-[300px] bg-purple-50 rounded-full px-4 py-4 text-base pr-12"
                        placeholder={placeholder}
                        placeholderTextColor="#9ca3af"
                        keyboardType={keyboardType}
                        secureTextEntry={secureTextEntry ? !isVisible : false}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 1,
                        }}
                        value={value}
                        onChangeText={onChangeText}
                        {...props}
                    />

                    {secureTextEntry && (
                        <TouchableOpacity
                            className="absolute right-4 top-12 h-6 w-6 justify-center items-center"
                            onPress={() => setIsVisible(!isVisible)}
                        >
                            <Feather
                                name={isVisible ? 'eye' : 'eye-off'}
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CustomTextInput;
