import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Feather, MaterialIcons, Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 80,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                    elevation: 5,
                },

            }}
        >
            <Tabs.Screen
                name="Tasks"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome5 name="list-ul" size={35} color={focused ? '#7c3aed' : '#9ca3af'} />
                    ),
                    tabBarIconStyle: {
                        height: 50,
                        width: 50
                    }
                }}
            />

            
            <Tabs.Screen
                name="Create"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? 'white' : '#7c3aed',
                                width: 60,
                                borderColor:  '#7c3aed',
                                borderWidth: 5,
                                height: 60,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: -20,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            <AntDesign name="plus" size={30} color={focused ? '#7c3aed' : 'white'} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="Dates"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Feather name="calendar" size={35} color={focused ? '#7c3aed' : '#9ca3af'} />
                    ),
                    tabBarIconStyle: {
                        height: 50,
                        width: 50
                    }
                }}
            />
        </Tabs>
    );
}
