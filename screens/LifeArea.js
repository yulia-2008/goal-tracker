import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function LifeArea({navigation, route}) {
  const areaObject = route.params.areaObject
  return (
    <View style={styles.container}>
      {console.log("Area", route.params)} 
      <ScrollView horizontal={false}  
                  persistentScrollbar= {false}
                  style={styles.scrollView}> 
          {route.params && areaObject ?        
          areaObject.goals.map(item=> { 
             return <TouchableOpacity key={item.id}
                                      onPress={() => {
                                        navigation.navigate("Goal", {goalObject: item}), 
                                        navigation.setParams({newGoalAddedTo: false})
                                      }}                                     
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
  scrollView: {
    width: '100%'
  },
  item: {
    backgroundColor: 'white',                                     
    margin: 10,
    width: '70%',
    height: 90,
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: 'rgb(104, 149, 197)' 
  },
});

