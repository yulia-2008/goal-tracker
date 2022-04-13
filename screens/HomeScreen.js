import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';

export default function HomeScreen({navigation, route}) {

  const [goalsData, updateGoals] = useState([
    {areaName: "Mind: Personal Development",  key: 1, goals: []},
    {areaName: "Body: Health & Fitness", key:2, goals: []},
    {areaName: "Career",  key: 3, goals: []},
    {areaName: "Relationship: Friends & Fam",  key: 4, goals: []},
    {areaName: "Finance",  key: 5, goals: []},
    {areaName: "Relaxation: Fun & Entertainment",  key: 6, goals: []}, 
  ])
  useEffect(() => {getData()}, [])

  useEffect(() => {
    AsyncStorage.setItem("storedData", JSON.stringify(goalsData))
    }, [goalsData]
  )

  // const areaNamesArray = () => {
  // let array = []
  // goalsData.map(item => array.push(item.areaName))
  // return array
  // }

  let getData = async () =>  {
    let keys = await AsyncStorage.getAllKeys()
    if (keys.includes('storedData')){
       await AsyncStorage.getItem('storedData')
       .then(data => JSON.parse(data))
       .then(data => {updateGoals(data)
       })
    }
  }

  // const addGoal = () => {
  //   let newGoals = [...goalsData]
  //   let  foundArea = newGoals.find(item =>  item.areaName === selectedArea)
  //   foundArea.goals = [ text ] 
  //   updateGoals(newGoals) 
  //   console.log("goalsData in addGoals", goalsData)
  // }

  return (
      <View style={styles.container}>
        <View style={styles.itemBox}>
          <FlatList 
              data={goalsData}
              numColumns={2}
              renderItem={({item}) =>
                  <TouchableOpacity style={styles.item}
                                    onPress={() => {navigation.navigate("Screen2", {goalArea: item})}} >
                      <Text>{item.areaName}</Text>               
                  </TouchableOpacity>   
              }         
          /> 
        </View> 
        <View style={styles.buttonBox}>     
          <TouchableOpacity style={styles.button}
                               onPress = {() => {navigation.navigate("AddScreen")}}>                         
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
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: 'red' 
  },
  item: {
    backgroundColor: '#ffc',
    width: 170,                                      
    height: 90,
    margin: 10,
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: 'grey' 
  },
  button: {
    // width: 27,                                      
    // height: 22,
    backgroundColor: 'yellow',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius:8,
    borderColor: 'grey',
    padding: 5
  },
  itemBox:{
    flex:2,
    width: "100%",
    borderWidth: 2,
    borderColor: 'green'
   },
  buttonBox: {
    flex:1,
    width: "100%",
    borderWidth: 3,
    borderColor: 'blue',
    alignItems: 'center'
   }
});

