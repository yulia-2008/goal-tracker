import { useIsFocused } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, 
         TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from '../components/DatePicker.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Calendar from 'expo-calendar';

export default function AddScreen({navigation, route}) {

  const areaData = [
    "Mind: Personal Development",  
    "Body: Health & Fitness", 
    "Career",  
    "Relationship: Friends & Fam",  
    "Finance",  
    "Relaxation: Fun & Entertainment"
  ]
  const rangeData = [
     "one time goal", "every day", " every other day", "every week", 
     "every month", "2 times a week", "3 times a week", 
     " 2 times a month", "every week-end"
  ]
  const [area, updateArea] = useState(null)
  const [timeRange, updateTimeRange] = useState(null)
  const [text, updateText] = useState("")
  const [ date, updateDate] = useState(null)
  const [ month, updateMonth] = useState(null)
  const [ year, updateYear] = useState(null)
  const [datePicker, updateDatePicker] = useState(false)
  // const [inputFieldInUse, updateInputFieldInUse] = useState("false")


  useEffect(() => {updateDatePicker(false)}, [])

  const addGoal = () => {
          // chek if all input filled, 
          // update data in AsyncStorage => HomeScreen updating as well,
          // passing newGoalObject to HomeScreen so it can display "New goal was added" in a right container
    if (area === null || timeRange === null || text.trim() === "" || 
        date === null || month === null || year === null) { 

        null
        }
    else { 
      let newGoalObject = {
        area: area, 
        timeRange: timeRange, 
        text: text, 
        date: date, 
        month: month, 
        year: year
      }
      let goals = [...route.params.goalsData]
      let  foundArea = goals.find(item =>  item.areaName === newGoalObject.area)
      foundArea.goals.push(newGoalObject)
      AsyncStorage.setItem("storedData", JSON.stringify(goals))
          
      navigation.navigate("HomeScreen", {newGoalObject})   
    }  
  }

  return ( 
    <>
    <TouchableWithoutFeedback  onPress={()=> {Keyboard.dismiss(), updateDatePicker(false)}} >
      <View style={styles.container}> 
      {/* {console.log("in AddScreen", route.params.goalsData)}  */}
        <View style = {styles.box1} 
         onPress = {()=> {updateDatePicker(false)}}>                       
          <SelectDropdown data = {areaData}
                          defaultButtonText = "Select goal area"
                          buttonStyle = {styles.button}
                          dropdownStyle = {styles.dropdown}
                          dropdownIconPosition = "left"
                          onFocus={()=> {updateDatePicker(false)}}
                          onSelect={(selectedItem) => updateArea(selectedItem)}
                          buttonTextAfterSelection={(selectedItem) => {return selectedItem}}
                          />
          <TextInput  style={styles.inputField}
                      // autoFocus={false} 
                       placeholder="new goal...  " 
                      //  value={text}
                          // onChangeText={text=>updateText(text)}
                          // onEndEditing={()=> addGoal()}
                      // onStartEditing = {()=>updateDatePicker(false)}
                      //onFocus = {()=> updateInputFieldInUse(true)}
                      onPressIn={()=>{updateDatePicker(false)}}
                      onChangeText={enteredText=> updateText(enteredText)}                   
                      required
                      multiline={true}                  
                      />            
          <SelectDropdown data = {rangeData}
                          defaultButtonText = "Time Range"
                          buttonStyle = {styles.button}
                          dropdownStyle = {styles.dropdown}
                          dropdownIconPosition = "left"
                          onFocus={()=> {updateDatePicker(false)}}
                          onSelect={(selectedItem) => updateTimeRange(selectedItem)}
                          buttonTextAfterSelection={(selectedItem) => {return selectedItem}}
                          />
        </View> 
        
        <View style={styles.box2}>
          <TouchableOpacity onPress={()=>{updateDatePicker(!datePicker), Keyboard.dismiss()}}
                            style={styles.button}>         
            <Text> 
              { date === null || month === null || year === null ?
                "Deadline" : 
                "Deadline:" + " " + month  + " " + date  + ", " + year 
              }
            </Text>  
          </TouchableOpacity>
            { datePicker ? <DatePicker dateHandler = {updateDate}
                                       monthHandler = {updateMonth}
                                       yearHandler = {updateYear} />
             : null }
        </View>
        <View style={styles.box3}>
          <TouchableOpacity style={styles.setButton}
                            onPress={() => {addGoal()}}
                            >
            <Text >Set Goal</Text>
          </TouchableOpacity> 
        </View>
      </View>
    </TouchableWithoutFeedback> 
   </>                  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:4,
    borderColor:"green"
  },
  box1:{
    flex:2,
    marginLeft: "10%",
    marginRight: "10%",
    borderWidth:2,
    borderColor:"red",
    justifyContent: 'space-around'
  },
  box2:{
    flex:2,
    width:'80%',
    borderWidth:2,
    marginTop: 15,
    borderColor:"blue",
    justifyContent: 'flex-start'
  },
  box3:{
    flex:1,
    marginLeft: "10%",
    marginRight: "10%",
    borderWidth:2,
    borderColor:"yellow",
    justifyContent: 'flex-start',
  },
  button:{
    borderWidth: 2,
    borderColor: 'grey',
    backgroundColor:"white",
    borderRadius:8,
    width:"100%",
    height:55, 
    padding: 15,                           
    },
  setButton:{
    borderWidth: 2,
    borderColor: 'grey',
    backgroundColor:"yellow",
    borderRadius:8,
    padding: 10
    },
  dropdown:{
    flex:1,
    borderRadius:8,
    height: 300
    },
  inputField:{
    borderWidth: 2,
    borderColor: 'grey',
    backgroundColor:"white",
    borderRadius:8,
    height:55, 
    padding: 15 
  }
});

