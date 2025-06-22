import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import React from 'react';

type Props = {
    title: string;
    className?: string;
    titleStyle?: string;
    onPress?: any;
};

const CustomButton = ({ title, className = '', titleStyle = '', onPress, ...props}: Props) => {
    return (
        <TouchableOpacity
            {...props}
            className={`bg-purple-700 rounded-[28px] px-6 py-5 items-center justify-center ${className}`}
            style={[
                Platform.OS === 'ios' ? styles.iosShadow : styles.androidShadow,
            ]}
            onPress={onPress}
        >
            <Text className={`text-white font-bold ${titleStyle}`}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iosShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    androidShadow: {
        elevation: 6,
    },
});

export default CustomButton;
