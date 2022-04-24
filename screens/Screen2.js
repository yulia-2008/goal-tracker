import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function Screen2({navigation, route}) {
  const goalsObject = route.params.goalArea
  return (
    <View style={styles.container}>
      {console.log("screen 2", route.params)} 
      <ScrollView horizontal={true}  
                  persistentScrollbar= {false}> 
          {route.params && goalsObject ?        
          goalsObject.goals.map(item=> { 
             return <TouchableOpacity 
                                      // onPress={() => {openMemo(memo)} }                                     
                                      style={styles.item}> 
                                      <Text> Goal: {item.text} </Text> 
                                      <Text> Deadline: {item.month} - {item.date} - {item.year} </Text>
                                      <Text> Pereodicity: {item.timeRange} </Text>
                                      
                    </TouchableOpacity>
          })
          :
          <Text>No goals set</Text>
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:3,
    borderColor: 'grey',
    backgroundColor: '#ffe',
    alignItems: 'flex-start' 
  },
  item: {
    backgroundColor: 'white',                                     
    margin: 10,
    height: 90,
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: 'rgb(104, 149, 197)' 
  },
});

