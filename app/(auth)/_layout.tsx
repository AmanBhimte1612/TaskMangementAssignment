import { Stack } from 'expo-router';
import 'react-native-reanimated';


export default function Layout() {
    

    return (
            <Stack>
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" options={{ headerShown: false }} />
                <Stack.Screen name="Login" options={{ headerShown: false }} />
            </Stack>
        
    );
}
