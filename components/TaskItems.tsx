import React, { useRef } from 'react';
import {
    Animated,
    LayoutAnimation,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CustomCheckbox from './CustomCheckbox';
import { parse } from 'date-fns';

import { isBefore } from 'date-fns';

const isPastDate = (dateStr: string): boolean => {
    try {
        const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
        const today = new Date();

        // Optional: reset time to midnight for accurate comparison
        today.setHours(0, 0, 0, 0);
        parsedDate.setHours(0, 0, 0, 0);

        return isBefore(parsedDate, today);
    } catch (error) {
        console.warn('Invalid date format:', dateStr);
        return false;
    }
};


function parseTime(timeStr: string) {
    const cleanTime = timeStr.replace(/\u202f/g, '').replace(/\s+/g, '');
    return parse(cleanTime.trim(), 'h:mma', new Date());
}



const TaskItem = ({ item, onDelete, onComplete, onExpand, isExpanded,disable }: any) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const isCompleted = item.status?.toLowerCase() === 'completed';
    const dueTime = parseTime(item.time);
    const now = new Date();
    const isPastDue = dueTime < now;
    console.log(now)
    console.log(parseTime(item.time))

    const handleDelete = () => {
        Animated.timing(translateX, {
            toValue: -500,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onDelete(item.id));
    };

    // 🏷️ Determine status badge label and color
    let statusBadge = {
        label: '',
        color: '',
    };

    if (isCompleted) {
        statusBadge = { label: 'Completed', color: '#22c55e' }; // Green
    } else if (isPastDue && isPastDate(item.dueDate)) {
        statusBadge = { label: 'Task Missed', color: '#dc2626' }; // Red
    } else {
        statusBadge = { label: 'Incomplete', color: '#7e22ce' }; // Purple
    }

    return (
        <Animated.View
            style={[
                styles.card,
                isCompleted && styles.disabledCard,
                { transform: [{ translateX }] },
            ]}
        >
            <View style={styles.row}>
                <CustomCheckbox
                    checked={isCompleted}
                    onPress={() => {
                        if (!isCompleted && !isPastDue) {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            onComplete(item.id);
                        }
                    }}
                    disabled={isCompleted || isPastDue || isPastDate(item.dueDate)||disable}
                    redOutline={isPastDue && !isCompleted&&isPastDate(item.dueDate)}
                />

                <TouchableOpacity
                    style={styles.textContainer}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        onExpand(item.id);
                    }}
                    disabled={disable}
                >
                    <View style={styles.topRow}>
                        <View>
                            <Text style={styles.title}>{item.taskTitle}</Text>
                            <Text style={styles.date}>{item.dueDate} {item.time}</Text>
                        </View>

                        <View style={styles.rightBadges}>
                            <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
                                <Text style={styles.statusText}>{statusBadge.label}</Text>
                            </View>

                            <View
                                style={[
                                    styles.priorityBadge,
                                    {
                                        backgroundColor:
                                            item.priority === 'High'
                                                ? '#dc2626'
                                                : item.priority === 'Medium'
                                                    ? '#fb923c'
                                                    : '#22c55e',
                                    },
                                ]}
                            >
                                <Text style={styles.priorityText}>{item.priority}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{item.taskDes}</Text>
                    <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                        <AntDesign name="delete" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
};

export default TaskItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 3,
    },
    disabledCard: {
        opacity: 0.5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rightBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 50,
        marginRight: 6,
    },
    statusText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    priorityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        marginTop: 12,
        backgroundColor: '#f3f4f6',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    description: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    deleteButton: {
        backgroundColor: '#dc2626',
        padding: 8,
        borderRadius: 20,
        marginLeft: 10,
    },
});
