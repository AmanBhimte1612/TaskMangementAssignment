import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import { format } from 'date-fns';
const { width, height } = Dimensions.get('window');

type Props = {
    headerTitle: string;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    showLeft?: boolean;
    showRight?: boolean;
};

const Header = ({
    headerTitle,
    onLeftPress,
    onRightPress,
    showLeft = true,
    showRight = true,
}: Props) => {
    const iconSize = width * 0.08;
    const iconButtonSize = width * 0.13;
    const searchHeight = height * 0.045;
    const circleSize = width * 0.40;
    const todayString = `Today, ${format(new Date(), 'd MMM')}`;

    return (
        <View style={[styles.headerContainer, { height: height * 0.18 }]}>
            {/* Background Circle */}
            <View
                style={[
                    styles.circle,
                    {
                        width: circleSize,
                        height: circleSize,
                        bottom: -circleSize * 0.22,
                        left: -circleSize * 0.14,
                        borderRadius: circleSize / 2,
                    },
                ]}
            />

            {/* Top Row */}
            <View style={styles.topRow}>
                {/* Left Icon */}
                {showLeft && (
                    <TouchableOpacity
                        onPress={onLeftPress}
                        style={[styles.iconButton, { width: iconButtonSize, height: iconButtonSize }]}
                    >
                        <Octicons name="apps" size={iconSize} color="white" />
                    </TouchableOpacity>
                )}

                {/* Search Bar */}
                <View style={[styles.searchBar, { height: searchHeight, width: width * 0.6 }]}>
                    <TextInput
                        style={[styles.input, { height: searchHeight }]}
                        placeholder="Search"
                        placeholderTextColor="#9ca3af"
                    />
                    <FontAwesome
                        name="search"
                        size={iconSize * 0.5}
                        color="#9ca3af"
                        style={styles.searchIcon}
                    />
                </View>

                {/* Right Icon */}
                {showRight && (
                    <TouchableOpacity
                        onPress={onRightPress}
                        style={[styles.iconButton, { width: iconButtonSize, height: iconButtonSize }]}
                    >
                        <Entypo name="dots-three-horizontal" size={iconSize * 0.75} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Bottom Titles */}
            <View style={styles.bottomText}>
                <Text style={[styles.dateText, { fontSize: width * 0.035 }]}> {`Today, ${format(new Date(), 'd MMM')}`}</Text>
                <Text style={[styles.titleText, { fontSize: width * 0.05 }]}>{headerTitle}</Text>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#9333ea',
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 40,
    },
    circle: {
        backgroundColor: '#a855f7',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        gap: 12,
    },
    iconButton: {
        backgroundColor: '#a855f7',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 999,
        paddingLeft: 35,
        paddingRight: 10,
        fontSize: 14,
        color: '#1f2937',
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
    },
    bottomText: {
        position: 'absolute',
        bottom: 8,
        left: 16,
    },
    dateText: {
        color: '#e9d5ff',
        fontWeight: 'bold',
    },
    titleText: {
        color: '#f3e8ff',
        fontWeight: 'bold',
    },
});
