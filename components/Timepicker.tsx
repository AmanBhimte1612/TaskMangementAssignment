import React, { useEffect, useState } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
    value?: string; // 🔄 controlled value from parent
    setTime: (time: string) => void;
    placeHolder?: string;
    className?: string;
};

const TimePicker = ({ value, setTime, placeHolder, className }: Props) => {
    const [show, setShow] = useState(false);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    // 🔄 Reset selectedTime when external value is cleared
    useEffect(() => {
        if (!value) {
            setSelectedTime(null);
        }
    }, [value]);

    const onChange = (_: any, time?: Date) => {
        setShow(Platform.OS === 'ios');
        if (time) {
            setSelectedTime(time);
            const formatted = time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
            setTime(formatted);
        }
    };

    const displayTime =
        selectedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';

    return (
        <View>
            <Pressable onPress={() => setShow(true)}>
                <TextInput
                    placeholder={placeHolder || 'Select Time'}
                    className={className}
                    value={value || displayTime}
                    editable={false}
                    pointerEvents="none"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 6,
                        elevation: 1,
                    }}
                />
            </Pressable>

            {show && (
                <DateTimePicker
                    value={selectedTime || new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChange}
                />
            )}
        </View>
    );
};

export default TimePicker;
