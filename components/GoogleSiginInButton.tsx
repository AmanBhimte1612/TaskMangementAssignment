import React, { useEffect } from 'react';
import { Button, View, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/FirebaseConfig'; // use your correct path
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '959092377557-pgumdmdmqto41meue1oslfnc1cktgnmf.apps.googleusercontent.com',
        webClientId: '959092377557-i2qrho8k49nsa9548ruat92pf8r89aap.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);

            signInWithCredential(auth, credential)
                .then((userCred) => {
                    Alert.alert('Login successful!', `Welcome ${userCred.user.displayName}`);
                    router.replace('/(tabs)/Tasks');
                })
                .catch((error) => {
                    Alert.alert('Login failed', error.message);
                });
        }
    }, [response]);

    return (
        <View style={{ marginTop: 16 }}>
            <Button
                title="Continue with Google"
                onPress={() => promptAsync()}
                disabled={!request}
            />
        </View>
    );
}
