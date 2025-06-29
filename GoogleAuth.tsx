import React, { useEffect } from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';
import { auth } from '@/FirebaseConfig'
WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        // expoClientId: 'YOUR_EXPO_CLIENT_ID',
        webClientId: '959092377557-pgumdmdmqto41meue1oslfnc1cktgnmf.apps.googleusercontent.com',
        androidClientId: '959092377557-pgumdmdmqto41meue1oslfnc1cktgnmf.apps.googleusercontent.com',
        // iosClientId: 'YOUR_IOS_CLIENT_ID',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(userCred => {
                    console.log('✅ Logged in:', userCred.user.email);
                })
                .catch(error => {
                    console.error('❌ Firebase Auth Error:', error);
                });
        }
    }, [response]);

    return (
        <Button
            title="Sign in with Google"
            disabled={!request}
            onPress={() => promptAsync()}
        />
    );
}
