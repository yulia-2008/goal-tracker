import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen.js';
import LifeArea from './screens/LifeArea.js';
import Goal from './screens/Goal.js';
import AddScreen from './screens/AddScreen.js';

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
            name="AddScreen"
            component={ AddScreen }      
            options={{
              headerTitle: "Add Goal",
              headerStyle: {                   
                  backgroundColor: 'rgb(104, 149, 197)',
                  height: 70,          
              }            
            }}              
          />  
          <Stack.Screen
            name="LifeArea"
            component={LifeArea}
            options={ 
              ({route}) =>({ 
                  title: route.params.areaObject.lifeArea,
                    // areaObject is a prop comes from HomeScreen.js onPress 
                  headerStyle: {
                      backgroundColor: 'rgb(104, 149, 197)', 
                      height: 70
                  }
              })
          }       
          /> 
          <Stack.Screen
            name="Goal"
            component={Goal}
            options={ 
              ({route}) =>({ 
                  title: 'Goal',
                     // route.params.goalObject.text,
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