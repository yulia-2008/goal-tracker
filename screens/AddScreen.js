import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, 
         TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from '../components/DatePicker.js'
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
     "every day", " every other day", "every week", 
     "every month", "2 times a week", "3 times a week", 
     " 2 times a month", "every week-end"
  ]
  const [area, updateArea] = useState(null)
  const [text, updateText] = useState("")
  const [datePickerOpened, openDatePicker] = useState("false")

  return ( <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>                         
        <SelectDropdown data = {areaData}
                        defaultButtonText = "Select goal area"
                        buttonStyle = {styles.button}
                        dropdownStyle = {styles.dropdown}
                        dropdownIconPosition = "left"
                        onSelect={(selectedItem) => {updateArea(selectedItem)}}
                        buttonTextAfterSelection={(selectedItem) => {return selectedItem}}
                        />
        <TextInput  autoFocus={true} 
                    placeholder="new goal...  " 
                        // onChangeText={text=>updateText(text)}
                        // onEndEditing={()=> addGoal()}
                    onEndEditing={text=> updateText(text)}
                    
                    required
                    multiline={true}
                    style={styles.button}
                    />          
        <TouchableOpacity></TouchableOpacity>  
        <SelectDropdown data = {rangeData}
                        defaultButtonText = "Time Range"
                        buttonStyle = {styles.button}
                        dropdownStyle = {styles.dropdown}
                        dropdownIconPosition = "left"
                        onSelect={(selectedItem) => {console.log("o", selectedItem)}}
                        buttonTextAfterSelection={(selectedItem) => {return selectedItem}}
                        />
        {datePickerOpened  ? 
          <DatePicker/>
          :             
          <TouchableOpacity style={styles.button} onPress={()=>{openDatePicker(true)}}>         
              <Text>Deadline.</Text>         
          </TouchableOpacity>
        }
        <TouchableOpacity>
            <Text style={styles.setButton}>Set Goal</Text>
        </TouchableOpacity> 
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
    justifyContent: 'flex-start'
  },
  button:{
    borderWidth: 2,
    borderColor: 'grey',
    backgroundColor:"white",
    borderRadius:8,
    width:"80%",
    height:55, 
    marginTop:30,
    padding: 10                             
    },
  setButton:{
    borderWidth: 2,
    borderColor: 'grey',
    backgroundColor:"yellow",
    borderRadius:8,
    marginTop:30,
    padding: 10
    },
  dropdown:{
    flex:1,
    borderRadius:8,
    height: 300
    }
  // inputField: {
  //   width: "80%",
  //   borderWidth: 2,
  //   borderColor: 'grey',
  //   backgroundColor:"white",
  //   borderRadius:8,
  //   height:45, 
  // }
});

