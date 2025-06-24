import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet,
    Pressable,
} from 'react-native';

const { width } = Dimensions.get('window');

type SideMenuProps = {
    visible: boolean;
    onClose: () => void;
    items: { label: string; onPress: () => void }[];
};

export default function SideMenu({ visible, onClose, items }: SideMenuProps) {
    const translateX = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : -width,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={StyleSheet.absoluteFill}>
            <Pressable style={styles.overlay} onPress={onClose} />

            <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => {
                            item.onPress();
                            onClose(); // close after item is pressed
                        }}
                    >
                        <Text style={styles.menuText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menu: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width * 0.6,
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 16,
        zIndex: 10,
    },
    menuItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
