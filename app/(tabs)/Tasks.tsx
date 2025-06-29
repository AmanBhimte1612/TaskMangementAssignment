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
import Header from '@/components/Header';
import { getSubcollectionData, deleteTaskFromFirestore, updateTaskInFirestore } from '@/sevices';
import { parse, compareAsc, isToday, set, } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import SideMenu from '@/components/SideMenu';
import PopupMenu from '@/components/PopupMenu';
import { useAuth } from '@/context/AuthContext';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { app } from '@/FirebaseConfig';
import TaskItem from '@/components/TaskItems';
import ConfirmationModal from '@/components/ConfirmtionModal';


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


const Tasks = () => {
    const auth = getAuth(app);
    const userId = auth.currentUser?.uid;
    // console.log('Current User ID:', userId);
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [taskList, setTaskList] = useState<any[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const { logout } = useAuth();
    const [refresh, setRefresh] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setTitle] = useState('')
    const [modalMessage, setMessage] = useState('')
    const [onConfirm, setConfirm] = useState<() => void>(() => () => { });



    const fetchAndSetTasks = async () => {
        const tasksData = await getSubcollectionData(
            'Users',
            userId,
            'Tasks'
        );
        const todaysTasks = getTodaysTasks(tasksData);
        const sortedTasks = sortTasks(todaysTasks);
        setTaskList(sortedTasks);
        // console.log('Tasks:', sortedTasks);
    };
    useFocusEffect(
        useCallback(() => {
            fetchAndSetTasks();
        }, [])
    );

    const toggleComplete = (id: string) => {
        setTitle('Task Completed?')
        setMessage("Are you sure yow want to mark this as Completed, it con't be undone..")
        setConfirm(() => {

            const updated = taskList.map((task) =>
                task.id === id ? { ...task, status: 'Completed' } : task
            );
            updateTaskInFirestore(userId, id, { status: 'Completed' })

            setTaskList(sortTasks(updated));
            setShowModal(false);

        })
        setShowModal(true);

    };

    const toggleExpand = (id: string) => {
        setExpandedTask((prev) => (prev === id ? null : id));
    };

    const handleDelete = (id: string) => {
        setTitle('Delete Task')
        setMessage('Are you sure yow want to delete this task from your list')
        setConfirm(() => {

            const updated = taskList.filter((task) => task.id !== id);
            deleteTaskFromFirestore(userId, id);
            setTaskList(sortTasks(updated));
            setShowModal(false);

        })
        setShowModal(true);

    };

    const handleLogout = () => {
        setTitle('Log Out?');
        setMessage('Are you sure you want to logout from the app?');
        setConfirm(() => async () => {
            await logout();
            setShowModal(false);
        });
        setShowModal(true);
    };


    const menuItems = [
        {
            label: 'My Profile',
            icon: <Feather name="user" size={20} color="black" />,
        },
        {
            label: 'Documents',
            icon: <MaterialIcons name="insert-drive-file" size={20} color="black" />,
        },
        {
            label: 'Log out',
            icon: <Entypo name="log-out" size={20} color="black" />,
            onPress: async () => {
                handleLogout();
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
                // onEndReached={}
                // onEndReachedThreshold={}
                refreshing={refresh}
                onRefresh={() => { fetchAndSetTasks() }}
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
            <ConfirmationModal
                visible={showModal}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => setShowModal(false)}
                onConfirm={onConfirm}
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

