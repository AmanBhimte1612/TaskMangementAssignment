import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CustomTextInput from '@/components/CustomTextInput';
import DateTime from '@/components/DateTime';
import PriorityDropdown from '@/components/PriorityDrodown';
import TimePicker from '@/components/Timepicker';
import CustomButton from '@/components/CustomButton';
import { handleSaveTask } from '@/sevices';
import { router } from 'expo-router';
import { app } from '@/FirebaseConfig';
import { getAuth } from 'firebase/auth';

const Create = () => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  const { width, height } = useWindowDimensions();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDes, setTaskDes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('');
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const form = {
    taskTitle,
    taskDes,
    dueDate,
    time,
    priority,
    status: 'inCompelete',
  };

  const validateFields = () => {
    const missing: string[] = [];
    if (!taskTitle.trim()) missing.push('Task Title');
    if (!taskDes.trim()) missing.push('Task Description');
    if (!dueDate.trim()) missing.push('Due Date');
    if (!time.trim()) missing.push('Time');
    if (!priority.trim()) missing.push('Priority');
    return missing;
  };

  const handleSubmit = async () => {
    const missingFields = validateFields();
    if (missingFields.length > 0) {
      setErrorFields(missingFields);
      return;
    }

    setErrorFields([]);
    try {
      const res = await handleSaveTask(userId, form);
      if (res === true) {
        alert('Task Created Successfully');
        router.push('/(tabs)/Tasks');
      } else {
        alert('Task Creation Failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while creating the task.');
    } finally {
      setTaskDes('');
      setTaskTitle('');
      setTime('');
      setPriority('');
      setDueDate('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header headerTitle="Create tasks" />

      <View className="flex-1 pt-10 items-center px-4 mt-5 py-8 gap-2">
        <CustomTextInput
          label="Task Title"
          placeholder="Task Title"
          value={taskTitle}
          onChangeText={setTaskTitle}
          style={{ width: width * 0.85 }}
        />

        <CustomTextInput
          label="Task Description"
          placeholder="Task Description (One Sentence)"
          value={taskDes}
          onChangeText={setTaskDes}
          style={{ width: width * 0.85 }}
        />

        <View
          style={{ width: width * 0.85 }}
          className="flex-row justify-between items-center gap-2 mb-6"
        >
          <DateTime
            className="border border-gray-300 bg-purple-50 rounded-full pl-4 py-4 text-base pr-12"
            value={dueDate}
            setdate={setDueDate}
            placeHolder="Due Date"
            style={{ width: width * 0.45 }}
          />

          <TimePicker
            className="border border-gray-300 bg-purple-50 rounded-full pl-4 py-4 text-base pr-12"
            value={time}
            setTime={setTime}
            placeHolder="Pick Time"
            style={{ width: width * 0.4 }}
          />
        </View>

        <PriorityDropdown
          selected={priority}
          setSelected={setPriority}
          style={{ width: width * 0.85 }}
        />

        {errorFields.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: 'red', textAlign: 'center', fontSize: 14 }}>
              Please fill: {errorFields.join(', ')}
            </Text>
          </View>
        )}

        <View style={{ width: width, height: height * 0.3 }} className="mt-20 items-center">
          <CustomButton
            title="Create Task"
            className="rounded-full"
            style={{ width: width * 0.6 }}
            titleStyle="text-xl"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Create;
