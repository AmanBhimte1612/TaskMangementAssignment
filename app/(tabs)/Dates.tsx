import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { getSubcollectionData } from '@/sevices';
import Checkbox from 'expo-checkbox';
import { isToday, isTomorrow, parse, differenceInCalendarDays, format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '@/FirebaseConfig'; // your initialized firebase app
import { getAuth } from 'firebase/auth';


const TaskCard = ({ task }: any) => {
  const isCompleted = task.status === 'completed';
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskLeft}>
        <Checkbox value={isCompleted} disabled={true} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{task.taskTitle}</Text>
          <Text style={styles.subtitle}>{task.dueDate}</Text>
        </View>
      </View>
      <View style={styles.tagsContainer}>
        <View style={[styles.tag, { backgroundColor: '#facc15' }]}>
          <Text style={styles.tagText}>{task.priority}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: '#60a5fa' }]}>
          <Text style={styles.tagText}>{task.status}</Text>
        </View>
      </View>
    </View>
  );
};



const groupTasksByDate = (tasks: any[]) => {
  const grouped: Record<string, any[]> = {};

  tasks.forEach((task) => {
    const [day, month, year] = task.dueDate.split('/').map(Number);
    const taskDate = new Date(year, month - 1, day);
    const today = new Date();

    let label = format(taskDate, 'dd/MM/yyyy');

    if (isToday(taskDate)) label = 'Today';
    else if (isTomorrow(taskDate)) label = 'Tomorrow';
    else if (differenceInCalendarDays(taskDate, today) <= 7) label = 'This week';

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(task);
  });

  // 🔽 Sort the group keys in the desired order
  const priorityOrder = {
    'Today': 1,
    'Tomorrow': 2,
    'This week': 3,
  };

  const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
    const getWeight = (label: string) =>
      priorityOrder[label] ?? 1000 + new Date(label.split('/').reverse().join('/')).getTime();

    return getWeight(a) - getWeight(b);
  });

  return Object.fromEntries(sortedEntries);
};


const Tasks = () => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  console.log('Current User ID:', userId);
  const [taskList, setTaskList] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchAndSetTasks = async () => {
        const tasksData = await getSubcollectionData(
          'Users',
          userId,
          'Tasks'
        );
        setTaskList(tasksData);
      };

      fetchAndSetTasks();
    }, []));

  const grouped = groupTasksByDate(taskList);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header headerTitle="By dates" />
      <ScrollView style={{ padding: 16, marginTop: 30 }}>
        {Object.entries(grouped).map(([date, tasks]) => (
          <View key={date} style={{ marginBottom: 24 }}>
            <Text style={styles.groupTitle}>
              {date} <Text style={styles.count}>({tasks.length})</Text>
            </Text>
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  count: {
    color: '#888',
    fontSize: 14,
    fontWeight: '400',
  },
  taskCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginLeft: 5,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
