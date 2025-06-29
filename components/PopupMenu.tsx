import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Pressable,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

type MenuItem = {
    label: string;
    icon: React.ReactNode;
    onPress: () => void;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    items: MenuItem[];
};

// https://taskmanagementassignment.firebaseapp.com/__/auth/handler

const PopupMenu = ({ visible, onClose, items }: Props) => {
    const scale = useSharedValue(0);
    const translateX = useSharedValue(50);
    const translateY = useSharedValue(-50);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
        opacity: scale.value,
    }));

    useEffect(() => {
        if (visible) {
            scale.value = withTiming(1, { duration: 250 });
            translateX.value = withTiming(0, { duration: 250 });
            translateY.value = withTiming(0, { duration: 250 });
        } else {
            scale.value = withTiming(0, { duration: 200 });
            translateX.value = withTiming(50, { duration: 200 });
            translateY.value = withTiming(-50, { duration: 200 });
        }
    }, [visible]);

    return (
        <Modal
            transparent
            animationType="none"
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View style={[styles.menuContainer, animatedStyle]}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => {
                                onClose();
                                item.onPress();
                            }}
                        >
                            <View style={styles.icon}>{item.icon}</View>
                            <Text style={styles.label}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

export default PopupMenu;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        paddingTop: 80,
        paddingRight: 10,
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        width: 150,
        paddingVertical: 6,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
});
