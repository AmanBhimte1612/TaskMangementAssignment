import { View, ActivityIndicator } from 'react-native';
import React from 'react';

type Props = {
    load: boolean;
};

const Loading = ({ load }: Props) => {
    return (
        <View className="flex-1 items-center justify-center">
            {load ? (
                <ActivityIndicator size={50} color={'#7e22ce'} />
            ) : null}
        </View>
    );
};

export default Loading;
