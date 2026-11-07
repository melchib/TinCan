import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateGroupScreen from "./screens/CreateGroupScreen";
import TestScreen from "./screens/TestScreen";
import LandingScreen from "./screens/LandingScreen";
import SignInScreen from "./screens/SignInScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CreateGroupScreen/>
  );
  //   <NavigationContainer>
  //     <Stack.Navigator
  //       initialRouteName="Landing"
  //       screenOptions={{ headerShown: false }}
  //     >
  //       <Stack.Screen name="Landing" component={LandingScreen} />
  //       <Stack.Screen name="SignIn" component={SignInScreen} />
  //       <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
  //       <Stack.Screen name="Inbox" component={HomeScreen} />
  //       <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}