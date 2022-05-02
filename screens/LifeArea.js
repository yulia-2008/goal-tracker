import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function LifeArea({navigation, route}) {
  const areaObject = route.params.areaObject
  const goalsData = route.params.goalsData
  return (
    <View style={styles.container}>
      {/* {console.log("Life Area", areaObject)}   */}
      <ScrollView horizontal={false}  
                  persistentScrollbar= {false}
                  style={styles.scrollView}> 
          {areaObject.goals.length > 0  ?        
              areaObject.goals.map((item, index) => {  // goal store as array of strings, they don't have no key, no id.
                return  <TouchableOpacity key={index}
                                          style={styles.item}
                                          onPress={() => {
                                            navigation.navigate("Goal", {goalObject: item}), 
                                            navigation.setParams({newGoalAddedTo: false}) 
                                                  // nedd to remove "New Goal Added" sign on HomeScreen.
                                          }}> 
                          <Text> Goal: {item.text} </Text> 
                          <Text> Deadline: {item.month} / {item.date} / {item.year} </Text>
                          <Text> Pereodicity: {item.timeRange} </Text>                                        
                        </TouchableOpacity>
              })
              : 
              <Text>No goals set</Text>     
          }
      </ScrollView> 
      <View style={styles.buttonBox}>  
            <TouchableOpacity style={styles.button}
                                    onPress = {() => { console.log("LifeArea Add button")
                                    //  need to create another AddScreen which is not going to display
                                    //  Area goal in Select options, because it is in necesary area already
                                    // or do conditional rendering in Select/AddScreen
                                    // added goalsData prop in HomeScreen, line 49, onPress !

                                      // navigation.navigate("AddScreen", {goalsData: goalsData}),
                                      // navigation.setParams({newGoalAddedTo: false})
                                        // need for removing "New Goal added" sign on HomeScreen"
                                      }}>                         
              <Text>Add a new goal</Text>  
            </TouchableOpacity> 
       </View> 
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    borderWidth:3,
    borderColor: 'grey',
    backgroundColor: '#ffe',
    alignItems: 'flex-start',
  },
  scrollView: {
   flex: 2,
    width: '100%',
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: 'yellow' 
  },
  item: {
    backgroundColor: 'white',                                     
    margin: 10,
    width: '70%',
    // height: 90,
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: 'rgb(104, 149, 197)' 
  },
  buttonBox: {
    flex: 0.2,
    width: '100%',
    borderWidth: 3,
    borderColor: 'blue',
    alignItems: 'center'
   },
  button: {
    
    backgroundColor: 'yellow',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderRadius:8,
    borderColor: 'rgb(104, 149, 197)',
    padding: 10,
  }
});

