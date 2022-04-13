import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen.js';
import Screen2 from './screens/Screen2.js';
import AddScreen from './screens/AddScreen.js';

export default function App() {
  const Stack = createStackNavigator();
  
  return ( <> 
      <NavigationContainer> 
        <Stack.Navigator>          
          <Stack.Screen
            name="HomeScreen"
            component={ HomeScreen }      
            options={{
              headerTitle: "HomeScreen",
              headerStyle: {                   
                  backgroundColor: "grey",
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
                    // area is a prop comes from HomeScreen.js onPress 
                  headerStyle: {
                      backgroundColor: "grey", 
                      height: 70
                  }
              })
          }       
          /> 
        </Stack.Navigator> 
      </NavigationContainer> 
      </>
  );
}