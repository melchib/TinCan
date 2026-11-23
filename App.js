import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {useState, useEffect} from 'react';
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';

import CreateGroupScreen from "./screens/CreateGroupScreen";
import TestScreen from "./screens/TestScreen";
import LandingScreen from "./screens/LandingScreen";
import SignInScreen from "./screens/SignInScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import HomeScreen from "./screens/HomeScreen";
import JoinGroupScreen from "./screens/JoinGroupScreen";
import GroupInboxScreen from "./screens/GroupInboxScreen";
import RecordMemoScreen from "./screens/RecordMemoScreen";
import GroupSettingsScreen from "./screens/GroupSettingsScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName="Landing"
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
          <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
          <Stack.Screen name="GroupInbox" component={GroupInboxScreen} />
          <Stack.Screen name="TestScreen" component={TestScreen} />
          <Stack.Screen name="RecordScreen" component={RecordMemoScreen} />
          <Stack.Screen name="GroupSettings" component={GroupSettingsScreen} />
          </>  
        ) : (
          <>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          </>
        )} 
      </Stack.Navigator>
    </NavigationContainer>
  );
}