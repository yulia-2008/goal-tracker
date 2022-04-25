import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Calendar from '../components/Calendar.js'

export default function Goal({navigation, route}) {
  const goal = route.params.goalObject;
  return (
    <View style={styles.container}>
      {console.log("Goal", goal)}   
        <Text>{goal.text}  </Text> 
        <Text> Deadline: {goal.month} - {goal.date} - {goal.year} </Text>
        <Text> Pereodicity: {goal.timeRange} </Text>
        <Calendar/>
                                      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:3,
    padding: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
    alignItems: 'flex-start' 
  }
});

