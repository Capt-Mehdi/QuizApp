// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage';
import SubjectQuizScreen from './SubjectQuizScreen';
import QuizScreen from './QuizScreen';
import QuizResultScreen from './QuizResultScreen';
import Login from './Login';
import Signup from './Signup';
import CustomQuizScreen from './CustomQuizScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="SubjectQuiz" component={SubjectQuizScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} />
        <Stack.Screen name="CustomQuiz" component={CustomQuizScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
