import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, 
         Keyboard, FlatList, Modal} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from '../components/DatePicker.js'

export default function HomeScreen({navigation, route}) {

  const [goalsData, updateGoals] = useState([
    {goal: false, id: 1, color: 'rgb(255, 204, 204)'},
    {goal: false, id: 2, color: 'rgb(255, 255, 204)'},
    {goal: false, id: 3, color: 'rgb(204, 255, 204)'},
    {goal: false, id: 4, color: 'rgb(204, 255, 255)'},
    {goal: false, id: 5, color: 'rgb(255, 204, 229)'},
    {goal: false, id: 6, color: 'rgb(229, 255, 204)'},
    {goal: false, id: 7, color: 'rgb(224, 224, 224)'},
    {goal: false, id: 8, color: 'rgb(229, 204, 255)'},
    {goal: false, id: 9, color: 'rgb(172, 252, 252)'},
    {goal: false, id: 10, color: 'rgb(255, 160, 122)'},
    {goal: false, id: 11, color: 'rgb(238, 232, 170)'},
    {goal: false, id: 12, color: 'rgb(216, 191, 216)'}
  ])

  const rangeData = [
    "One time", "Every day", "Every other day",  "2 times a week", "3 times a week",
    "Every week", "Every 2 weeks", "Every month", "2 times a month"
 ]
  const [itemId, setItemId] = useState(null) // after clicking on item, state keeps it's id
  const [timeRange, updateTimeRange] = useState(null)
  const [text, updateText] = useState("")
  const [ date, updateDate] = useState(null)
  const [ month, updateMonth] = useState(null)
  const [ year, updateYear] = useState(null)
  const [datePicker, showDatePicker] = useState(false)
  const [modal, showModal] = useState(false)
    
  useEffect(() => {getData()}, [])
  AsyncStorage.setItem("storedData", JSON.stringify(goalsData))  

  let getData = async () =>  {
    let keys = await AsyncStorage.getAllKeys()
    if (keys.includes('storedData')){
       await AsyncStorage.getItem('storedData')
       .then(data => JSON.parse(data))
       .then(data => {updateGoals(data)
       })
    }
  }

  let addGoal = () => {
    // chek if input is filled, create newGoalObject
    if (timeRange != null && text.trim() != "" ) { 
      let newGoal = { 
        // id: itemId,
        text: text,
        timeRange: timeRange,        
        date: date, 
        month: month, 
        year: year
      }
      let goals = [...goalsData]
      goals[itemId-1].goal = newGoal  // state itemId-1 == goal's index in goalData array
      updateGoals(goals)
      AsyncStorage.setItem("storedData", JSON.stringify(goals)) 
      showModal(!modal)    // closing Modal
    }  
    }

  return (
      <View style={styles.container}>
          {/* {AsyncStorage.removeItem('storedData') }    */}
        <View style={styles.itemBox}>
          <FlatList        // render containers with goals or empty conteiners
              data={goalsData}
              numColumns={2}
              renderItem={({item}) =>
                  <TouchableOpacity   
                      key={item.id}
                      style={ item.goal? [styles.item, {backgroundColor: item.color}]:
                                         [styles.item, {backgroundColor: 'rgb(224, 224, 224)'}]
                      }
                      onPress={() => {
                          item.goal ?
                            navigation.navigate("Goal", {goalObject: item}):                                       
                            showModal(!modal), setItemId(item.id)                
                      }}
                  >
                      {item.goal?  
                        <Text style={{color: 'black'}}>{item.goal.text}</Text>:
                        <Text style={{color: 'rgb(160, 160, 160)'}}>Add a new goal!</Text>               
                      }  
                      {console.log(item.goal)}
                  </TouchableOpacity>   
              }         
          /> 
        </View> 
        <Modal    // Creation of new Goal: 
                  // TextInput -> type goal, 
                  // SelectDropdown -> set time range for the goal
                  // DatePicker -> set deadline for the goal
                  // button: add/set goal
            visible = {modal}
            transparent = {true}>
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text 
                            style={styles.closeIcon}
                            onPress = {()=> showModal(!modal)}>
                        X 
                         {/* change X for closing icon */}
                        </Text> 
                        <TextInput  
                            style={styles.inputField}
                            autoFocus={true} 
                            placeholder="new goal...  " 
                            onPressIn={()=>{console.log("input")}}
                            onChangeText = {enteredText => updateText(enteredText)}                   
                            required
                            multiline={false} /> 
                                     
                        <SelectDropdown data = {rangeData}
                            defaultButtonText = "Time Range"
                            buttonStyle = {styles.button}
                            dropdownStyle = {styles.dropdown}
                            dropdownIconPosition = "left"
                            // onFocus={()=> {updateDatePicker(false)}}
                            onSelect = {(selectedItem) => updateTimeRange(selectedItem)}
                            buttonTextAfterSelection = {(selectedItem) => {return selectedItem}} />
                        <TouchableOpacity 
                            style = {styles.button}
                            onPress = {()=>{
                              showDatePicker(!datePicker), 
                              Keyboard.dismiss()
                            }}>                                   
                            <Text> 
                              { date === null || month === null || year === null ?
                                  "Deadline" :
                                  "Deadline:" + " " + month  + " " + date  + " " + year 
                              }
                            </Text>  
                        </TouchableOpacity>
                        { datePicker ? 
                            <DatePicker 
                                dateHandler = {updateDate}
                                monthHandler = {updateMonth}
                                yearHandler = {updateYear}
                                date = {date}
                                month = {month}
                                year = {year}
                            /> : null        
                        }
                    
                        <TouchableOpacity 
                            style={styles.setButton}
                            onPress={() => {addGoal()}}>
                                <Text>Set Goal</Text>
                        </TouchableOpacity> 
                    </View>
                </View> 
        </Modal>
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
    width: 150,                                      
    height: 100,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20, 
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  setButton:{
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRightWidth: 4, 
    borderColor: 'rgb(104, 149, 197)',
    backgroundColor:"yellow",
    borderRadius:8,
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
    flex: 0.2,
    width: '100%',
    borderWidth: 3,
    borderColor: 'blue',
    alignItems: 'center'
   },
  newGoal:{
    fontWeight: 'bold',
    color: 'blue', 
   },
  modal: {
    flex:1,
    backgroundColor: 'rgba(100, 100, 100, 0.1)', // 0.1 represents opacity
    justifyContent: 'center',
  },
  modalContent:{
    backgroundColor: 'white',
    height: 500,
    // alignSelf: 'center',
    margin: '10%',
    padding: '1%',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'grey'
   
  }, 
  closeIcon: {
    alignSelf: 'flex-end'
  },
  button:{
    borderWidth: 2,
    borderColor: 'rgb(104, 149, 197)',
    backgroundColor: "white",
    borderRadius:8,
    width: '100%',
    height:55, 
    padding: 15, 
    alignItems: 'center'                          
    },
  dropdown:{
    flex:1,
    borderRadius:8,
    height: 500
  },
  inputField:{
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor:"white",
    borderRadius:8,
    height:55, 
    padding: 15, 
    fontSize: 20 
  }
});

