import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';

export default function HomeScreen({navigation, route}) {

  const [goalsData, updateGoals] = useState([
    {areaName: "Mind: Personal Development",  id: 1, goals: []},
    {areaName: "Body: Health & Fitness", id:2, goals: []},
    {areaName: "Career",  id: 3, goals: []},
    {areaName: "Relationship: Friends & Fam",  id: 4, goals: []},
    {areaName: "Finance",  id: 5, goals: []},
    {areaName: "Relaxation: Fun & Entertainment",  id: 6, goals: []}, 
  ])

  
  useEffect(() => {getData()}, [])

  const isNewGoal = () => {
    let newGoal;
    if (route.params !=undefined && route.params.newGoalAddedTo) { 
          newGoal = route.params.newGoalAddedTo; 
        }    
    return newGoal
  }

  let getData = async () =>  {
    let keys = await AsyncStorage.getAllKeys()
    if (keys.includes('storedData')){
       await AsyncStorage.getItem('storedData')
       .then(data => JSON.parse(data))
       .then(data => {updateGoals(data)
       })
    }
  }

  return (
      <View style={styles.container}>
        {console.log("Home", route.params)} 
        <View style={styles.itemBox}>
          <FlatList 
              data={goalsData}
              numColumns={2}
              renderItem={({item}) =>
                  <TouchableOpacity style={styles.item}
                                    onPress={() => {
                                      navigation.navigate("Screen2", {goalArea: item}), 
                                      navigation.setParams({newGoalAddedTo: false})
                                          // need for clearing "New Goal added" sign on HomeScreen"
                                      }} >
                      <Text>{item.areaName}</Text> 
                      { isNewGoal() && isNewGoal() === item.areaName ?
                        <Text style={styles.newGoal}> New Goal added </Text>
                        :
                        null
                      }
                  </TouchableOpacity>   
              }         
          /> 
        </View> 
        <View style={styles.buttonBox}>     
          <TouchableOpacity style={styles.button}
                            onPress = {() => {
                              navigation.navigate("AddScreen", {goalsData: goalsData}),
                              navigation.setParams({newGoalAddedTo: false})
                                // need for clearing "New Goal added" on HomeScreen"
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: 'red' 
  },
  item: {
    backgroundColor: 'white',
    width: 170,                                      
    height: 90,
    margin: 10,
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: 'grey' 
  },
  button: {
    backgroundColor: 'yellow',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderRadius:8,
    borderColor: 'rgb(104, 149, 197)',
    padding: 10
  },
  itemBox:{
    flex:2,
    width: '100%',
    borderWidth: 2,
    borderColor: 'green', 
    alignItems: 'center'
  }, 
  buttonBox: {
    flex:1,
    width: '100%',
    borderWidth: 3,
    borderColor: 'blue',
    alignItems: 'center'
   },
   newGoal:{
    fontWeight: 'bold',
    color: 'blue', 
   }
});

