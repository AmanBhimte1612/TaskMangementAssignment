import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  redOutline?: boolean;
};

const CustomCheckbox = ({ checked, onPress, disabled = false, redOutline = false }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Checkbox pressed'); // Debug line
        onPress();
      }}
      disabled={disabled}
      style={[
        styles.checkbox,
        checked && styles.checked,
        redOutline && !checked && styles.redOutline,
        disabled && { opacity: 0.5 },
      ]}
    >
      {checked && <AntDesign name="check" size={16} color="white" />}
    </TouchableOpacity>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  redOutline: {
    borderColor: '#dc2626',
  },
});
