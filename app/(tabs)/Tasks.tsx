import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
    UIManager,
    LayoutAnimation,
    Button
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Checkbox from 'expo-checkbox';
import Header from '@/components/Header';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getSubcollectionData, deleteTaskFromFirestore } from '@/sevices';
import { parse, compareAsc, isToday, set, } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import SideMenu from '@/components/SideMenu';
import PopupMenu from '@/components/PopupMenu';
import { useAuth } from '@/context/AuthContext';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { app } from '@/FirebaseConfig'; // your initialized firebase app




type Task = {
    dueDate: string; // in format: 'yyyy/MM/dd' or 'dd/MM/yyyy'
    [key: string]: any;
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const sortTasks = (tasks: any[]) => {
    return [...tasks].sort((a, b) => {
        const aDate = parseDate(a.dueDate);
        const bDate = parseDate(b.dueDate);

        const dateCompare = compareAsc(aDate, bDate);
        if (dateCompare !== 0) return dateCompare; // First sort by date

        const aTime = parseTime(a.time);
        const bTime = parseTime(b.time);
        return compareAsc(aTime, bTime); // Then sort by time if date is same
    });
};

function parseDate(dateStr: string) {
    return parse(dateStr, 'd/M/yyyy', new Date());
}

function parseTime(timeStr: string) {
    const cleanTime = timeStr.replace(/\u202f/g, '').replace(/\s+/g, '');
    return parse(cleanTime.trim(), 'h:mma', new Date());
}

const getTodaysTasks = (tasks: any[]) => {
    return tasks.filter((task) => {
        const taskDate = parse(task.dueDate, 'd/M/yyyy', new Date());
        return isToday(taskDate);
    });
};

const TaskItem = ({ item, onDelete, onComplete, onExpand, isExpanded }: any) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const isCompleted = item.status === 'completed';

    const handleDelete = () => {
        Animated.timing(translateX, {
            toValue: -500,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onDelete(item.id));
    };

    return (
        <Animated.View
            style={[
                styles.card,
                isCompleted && styles.disabledCard,
                { transform: [{ translateX }] },
            ]}
        >
            <View style={styles.row}>
                <Checkbox
                    value={isCompleted}
                    onValueChange={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        !isCompleted && onComplete(item.id);
                    }}
                    disabled={isCompleted}
                />
                <TouchableOpacity
                    style={styles.textContainer}
                    disabled={isCompleted}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        onExpand(item.id);
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={styles.title}>{item.taskTitle}</Text>
                            <Text style={styles.date}>
                                {item.dueDate} {item.time}
                            </Text>
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
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{item.taskDes}</Text>
                    <TouchableOpacity
                        onPress={handleDelete}
                        style={styles.deleteButton}
                    >
                        <AntDesign name="delete" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
};

const Tasks = () => {
    const auth = getAuth(app);
    const userId = auth.currentUser?.uid;
    console.log('Current User ID:', userId);
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [taskList, setTaskList] = useState<any[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const { logout } = useAuth();

    useFocusEffect(
        useCallback(() => {
            const fetchAndSetTasks = async () => {
                const tasksData = await getSubcollectionData(
                    'Users',
                    userId,
                    'Tasks'
                );
                const todaysTasks = getTodaysTasks(tasksData);
                const sortedTasks = sortTasks(todaysTasks);
                setTaskList(sortedTasks);
                console.log('Tasks:', sortedTasks);
            };

            fetchAndSetTasks();
        }, [])
    );

    const toggleComplete = (id: string) => {
        const updated = taskList.map((task) =>
            task.id === id ? { ...task, status: 'Completed' } : task
        );
        
        setTaskList(sortTasks(updated));
    };

    const toggleExpand = (id: string) => {
        setExpandedTask((prev) => (prev === id ? null : id));
    };

    const handleDelete = (id: string) => {
        const updated = taskList.filter((task) => task.id !== id);
        deleteTaskFromFirestore(userId, id);
        setTaskList(sortTasks(updated));
    };

    const menuItems = [
        {
            label: 'My Profile',
            icon: <Feather name="user" size={20} color="black" />,
            onPress: () => console.log('Profile pressed'),
        },
        {
            label: 'Documents',
            icon: <MaterialIcons name="insert-drive-file" size={20} color="black" />,
            onPress: () => console.log('Documents pressed'),
        },
        {
            label: 'Log out',
            icon: <Entypo name="log-out" size={20} color="black" />,
            onPress: () => {
                logout();
            },
        },
    ];


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header headerTitle="Today's tasks" onLeftPress={() => { setMenuVisible(!menuVisible) }}
                onRightPress={() => { setMenuVisible(!menuVisible) }} />
            <PopupMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                items={menuItems}
            />

            <FlatList
                data={taskList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem
                        item={item}
                        onDelete={handleDelete}
                        onComplete={toggleComplete}
                        onExpand={toggleExpand}
                        isExpanded={item.id === expandedTask}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20, paddingTop: 10, marginTop: 30 }}
            />
        </SafeAreaView>
    );
};

export default Tasks;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#E9D5FF',
        margin: 10,
        borderRadius: 20,
        padding: 12,
    },
    disabledCard: {
        opacity: 0.5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    descriptionContainer: {
        marginTop: 10,
        paddingHorizontal: 6,
        position: 'relative',
    },
    description: {
        fontSize: 14,
        color: '#333',
        paddingRight: 40,
    },
    deleteButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#ef4444',
    },
    priorityBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    priorityText: {
        color: '#fff',
        fontSize: 12,
        textTransform: 'capitalize',
    },
});

