// import React from 'react';
import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen.js';
import Screen2 from './screens/Screen2.js';
import AddScreen from './screens/AddScreen.js';
import NewGoalContext from './components/NewGoalContext.js';


export default function App() {
  const Stack = createStackNavigator();
  const buttonContext = useContext(NewGoalContext);
  
  return (    
      <NavigationContainer> 
        {console.log("in app",buttonContext.buttonClicked )}
        <Stack.Navigator>          
          <Stack.Screen
            name="HomeScreen"
            component={
              buttonContext.buttonClicked ? AddScreen :
              HomeScreen
              
              }      
            options={{
              headerTitle: "HomeScreen",
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