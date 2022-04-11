import React from 'react';
import {Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screen1 from './screens/Screen1.js';
import Screen2 from './screens/Screen2.js';

export default function App() {
  const Stack = createStackNavigator();

  return (     
      <NavigationContainer> 
        <Stack.Navigator>          
          <Stack.Screen
            name="Test"
            component={Screen1}
            options={{
              headerTitle: "Screen 1",
              headerStyle: {                   
                  backgroundColor: "grey",
                  height: 70,          
              }            
            }}         
          /> 
          <Stack.Screen
            name="Screen2"
            component={Screen2}
            options={ 
              ({route}) =>({ 
                  title: route.params.goalArea.areaName,
                    // area is a prop comes from Screen1.js onPress 
                  headerStyle: {
                      backgroundColor: "grey", 
                      height: 70
                  }
              })
          }       
          /> 
        </Stack.Navigator> 
      </NavigationContainer>     
  );
}