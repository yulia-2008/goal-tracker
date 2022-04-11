import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';

export default function Test({navigation}) {
  const [goalsData, updateGoals] = useState([
    {areaName: "Mind: Personal Development",  key: 1, goals: []},
    {areaName: "Body: Health & Fitness", key:2, goals: []},
    {areaName: "Career",  key: 3, goals: []},
    {areaName: "Relationship: Friends & Fam",  key: 4, goals: []},
    {areaName: "Finance",  key: 5, goals: []},
    {areaName: "Relaxation: Fun & Entertainment",  key: 6, goals: []}, 
  ])
  const [buttonPressed, updateValue] = useState(false)
  useEffect(() => {getData()}, [])

  useEffect(() => {
    AsyncStorage.setItem("storedData", JSON.stringify(goalsData))
    }, [goalsData]
  )

  let getData = async () =>  {
    let keys = await AsyncStorage.getAllKeys()
    if (keys.includes('storedData')){
       await AsyncStorage.getItem('storedData')
       .then(data => JSON.parse(data))
       .then(data => {updateGoals(data), console.log("N", data)
       })
    }
  }

  const addGoal = (text) => {
    let newGoals = [...goalsData]
    let  foundArea = newGoals.find()
    // WORKING HERE !
    updateGoals(newGoalss) 
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemBox}>
        <FlatList 
            data={goalsData}
            numColumns={2}
            renderItem={({item}) =>
                <TouchableOpacity style={styles.item}
                                  onPress={() => {console.log("screen 1", item.areaName), navigation.navigate("Screen2", {goalArea: item})}} >
                    <Text>{item.areaName}</Text>               
                </TouchableOpacity>   
            }         
        /> 
      </View> 
      <View style={styles.buttonBox}>
        <Text>Tap to set a new goal </Text>
        <TouchableOpacity style={styles.plusIcon}
                          onPress={()=>updateValue(true)}
        >
          <Text>+</Text>
        </TouchableOpacity>  
        {buttonPressed? 
          <View style={styles.inputBox}>
            <TextInput  autoFocus={true} 
                        placeholder="  goal...  " 
                        onChangeText={text=>addGoal(text)}
                        required
                        multiline={true}
                        style={styles.inputField}
                        /> 
          </View>
        : null
        }  
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
  plusIcon: {
    width: 27,                                      
    height: 22,
    backgroundColor: 'yellow',
    alignItems: 'center'
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
   },
   inputField: {
    width: "80%",
    borderWidth: 2,
    borderColor: 'grey',
   },
   inputBox:{
    width: "100%",
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'red',
    margin: 20
   }
});

