import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen.js';
import Goal from './screens/Goal.js';

export default function App() {
  const Stack = createStackNavigator();
  
  return (
      <NavigationContainer> 
        <Stack.Navigator>          
          <Stack.Screen
            name="HomeScreen"
            component={ HomeScreen }      
            options={{
                headerTitle: "HomeScreen",
                headerStyle: {                   
                    backgroundColor: 'rgb(104, 149, 197)',
                    height: 70,          
                }            
            }}              
          />                     
          <Stack.Screen
            name="Goal"
            component={Goal}
            options={ 
              ({route}) =>({ 
                  title: route.params.goalObject.goal,
                    // goalObject is a prop comes from HomeScreen.js onPress 
                  headerStyle: {
                      backgroundColor: 'rgb(104, 149, 197)', 
                      height: 70
                  }
              })
          }       
          /> 
        </Stack.Navigator> 
      </NavigationContainer> 
  );
}