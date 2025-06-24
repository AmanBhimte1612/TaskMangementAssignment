import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Pressable,
} from 'react-native';
import { Feather, MaterialIcons, Entypo } from '@expo/vector-icons';

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

const PopupMenu = ({ visible, onClose, items }: Props) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.menuContainer}>
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
                </View>
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
