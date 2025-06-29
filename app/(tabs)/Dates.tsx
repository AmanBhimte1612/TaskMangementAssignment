import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import { useFocusEffect } from '@react-navigation/native';
import { getSubcollectionData } from '@/sevices';
import { getAuth } from 'firebase/auth';
import { app } from '@/FirebaseConfig';
import TaskItem from '@/components/TaskItems';
import { isToday, isTomorrow, differenceInCalendarDays, parse, isAfter } from 'date-fns';

const groupTasksByDate = (tasks: any[]) => {
  const grouped: Record<string, any[]> = {};

  tasks.forEach((task) => {
    const [day, month, year] = task.dueDate.split('/').map(Number);
    const taskDate = new Date(year, month - 1, day);
    const today = new Date();

    let label = task.dueDate;

    if (isToday(taskDate)) label = 'Today';
    else if (isTomorrow(taskDate)) label = 'Tomorrow';
    else if (differenceInCalendarDays(taskDate, today) <= 7 && taskDate > today) label = 'This week';

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(task);
  });

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

const isFutureOrToday = (dateStr: string, timeStr: string) => {
  try {
    const parsedDate = parse(`${dateStr} ${timeStr}`, 'd/M/yyyy h:mm a', new Date());
    return isAfter(parsedDate, new Date()) || isToday(parsedDate);
  } catch (e) {
    console.warn('Date parse error:', e);
    return false;
  }
};

const Tasks = () => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  const [taskList, setTaskList] = useState<any[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAndSetTasks = async () => {
        const tasksData = await getSubcollectionData('Users', userId, 'Tasks');
        const futureTasks = tasksData.filter((task: any) => isFutureOrToday(task.dueDate, task.time));
        setTaskList(futureTasks);
      };
      fetchAndSetTasks();
    }, [])
  );

  const grouped = groupTasksByDate(taskList);

  const toggleExpand = (id: string) => {
    setExpandedTask((prev) => (prev === id ? null : id));
  };

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
              <TaskItem
                key={task.id}
                item={task}
                onDelete={() => {}}
                onComplete={() => {}}
                onExpand={toggleExpand}
                isExpanded={task.id === expandedTask}
                disable={true}
              />
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
});
