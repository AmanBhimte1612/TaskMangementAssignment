import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

const priorityOptions = ['Low', 'Medium', 'High'];

const PriorityDropdown = ({
    selected,
    setSelected,
}: {
    selected: string;
    setSelected: (val: string) => void;
}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <View>
            <TouchableOpacity
                onPress={() => setShowModal(true)}
                className=" flex-row justify-between items-center border border-gray-300 w-[300px] bg-purple-50 rounded-full px-4 py-4 text-base pr-12"
            >
                <Text className="text-black text-lg">{selected || 'Select Priority'}</Text>
                <Feather name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>

            <Modal transparent visible={showModal} animationType="fade">
                <TouchableOpacity
                    className="flex-1 justify-center items-center bg-black/30"
                    activeOpacity={1}
                    onPressOut={() => setShowModal(false)}
                >
                    <View className="bg-white p-4 rounded-lg w-[80%]">
                        <FlatList
                            data={priorityOptions}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-3 border-b border-gray-200"
                                    onPress={() => {
                                        setSelected(item);
                                        setShowModal(false);
                                    }}
                                >
                                    <Text className="text-lg text-black">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default PriorityDropdown;
