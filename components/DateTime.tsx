import React, { useEffect, useState } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
    value?: string; // 🔄 Controlled from parent
    setdate: (date: string) => void;
    placeHolder?: string;
    className?: string;
};

const DateTime = ({ value, setdate, placeHolder, className }: Props) => {
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // 🔄 Reset selectedDate if parent clears it
    useEffect(() => {
        if (!value) {
            setSelectedDate(null);
        }
    }, [value]);

    const onChange = (_: any, date?: Date) => {
        setShow(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            setdate(formattedDate);
        }
    };

    const formattedValue = value
        ? value
        : selectedDate
            ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
            : '';

    return (
        <View>
            <Pressable onPress={() => setShow(true)}>
                <TextInput
                    placeholder={placeHolder || 'Select Date'}
                    value={formattedValue}
                    editable={false}
                    pointerEvents="none"
                    className={className}
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
                    value={selectedDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    onChange={onChange}
                />
            )}
        </View>
    );
};

export default DateTime;
