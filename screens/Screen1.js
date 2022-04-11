import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown'
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
  const [text, updateText] = useState("")
  const [selectedArea, updateSelectedArea] = useState(null)
  useEffect(() => {getData()}, [])

  useEffect(() => {
    AsyncStorage.setItem("storedData", JSON.stringify(goalsData))
    }, [goalsData]
  )

  const areaNamesArray = () => {
  let array = []
  goalsData.map(item => array.push(item.areaName))
  return array
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

  const addGoal = () => {
    let newGoals = [...goalsData]
    let  foundArea = newGoals.find(item =>  item.areaName === selectedArea)
    foundArea.goals = [ text ]
    // WORKING HERE ! need to debugg here!
    updateGoals(newGoals) 
    console.log("goalsData in addGoals", goalsData)
  }

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
        <Text>Tap to set a new goal </Text>
        <TouchableOpacity style={styles.plusIcon}
                          onPress={()=>updateValue(true)}
        >
          <Text>+</Text>
        </TouchableOpacity>  
        {buttonPressed? 
          <View style={styles.inputBox}>
            <SelectDropdown data={areaNamesArray()}
                            buttonStyle={{backgroundColor:"pink",
                            borderRadius:20,
                            width:270,
                            height:45, 
                            marginTop:20,                             
                            }}
                            onSelect={(selectedItem, index) => {
                              console.log("selected", selectedItem, index),
                              updateSelectedArea(selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item
                            }}
                          />
            <TextInput  autoFocus={true} 
                        placeholder="  goal...  " 
                        onChangeText={text=>updateText(text)}
                        onEndEditing={()=> addGoal()}
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

