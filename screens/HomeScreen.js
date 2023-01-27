import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, 
         Keyboard, FlatList, Modal, Image} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

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

  const monthsArray = [{id: 0, month: "-"}, {id:1, month:"January"},{id:2, month:"February"},
    {id:3, month:"March"}, {id:4, month:"April"}, {id: 5, month: "May"},
    {id:6, month: "June",}, {id:7, month:"July"}, {id:8, month:"August"},
    {id:9, month:"September"}, {id:10, month:"October"},
    {id:11, month:"November"},{id:12, month: "December"}
  ]
     
  const [itemId, setItemId] = useState(null) // after clicking on item, state keeps it's id
  const [timeRange, updateTimeRange] = useState(null)
  const [text, updateText] = useState("")
  const [ selectedDate, updateDate] = useState(null)
  const [ selectedMonth, updateMonth] = useState(null)
  const [ selectedYear, updateYear] = useState(null)
  // const [deadline, setDeadline] = useState({}) // value is undefined
  // const [datePicker, showDatePicker] = useState(false)
  const [modal, showModal] = useState(false)
  const [buttonText, updateButtonText] = useState("Time Range")
    
  useEffect(() => {getData()}, [])
  AsyncStorage.setItem("storedData", JSON.stringify(goalsData))  //??

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
        text: text,
        timeRange: timeRange,  
        deadline: {date: selectedDate, month: selectedMonth , year: selectedYear}      
      }
      let goals = [...goalsData]
      goals[itemId-1].goal = newGoal  // state itemId-1 == goal's index in goalData array
      updateGoals(goals)
      AsyncStorage.setItem("storedData", JSON.stringify(goals)) 
      showModal(!modal)    // closing Modal
      updateText("")      // clearing entered data 
      updateDate(null)
      updateMonth(null)
      updateYear(null)
      updateTimeRange(null)
    }
    else if(timeRange == null){
      updateButtonText('Select time range !!')
    }    
  }

  const datesArray = () => {
    // generates dates for goal deadline container
    // need to fix: allowed to chose dayte 31 for all months
    let array = [{id: 0, date: "-"}];
    for(let i = 1; i <= 31; i++){
      let newDate = {id: i, date: i}
      array.push(newDate);
    }
    return array
  }


  const yearsArray = () => {
    // generate years array for deadline container
    let array = [{id: 0, year: "-"}];
    let year = new Date().getFullYear()
    for(let i = year; i <= year+10; i++){
      let newYear = {id: i, year: i}
      array.push(newYear);
    }
    return array
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
                      }}>
                      {item.goal?  
                        <Text style={{color: 'black'}}>{item.goal.text}</Text>:
                        <Text style={{color: 'rgb(160, 160, 160)'}}>New Goal</Text>               
                      }  
                  </TouchableOpacity>   
              }         
          /> 
        </View> 
        <Modal    // Creation of new Goal: 
                  // TextInput -> type goal, 
                  // SelectDropdown -> set time range for the goal
                  // DatePicker -> set deadline for the goal
                  // button: add goal
            visible = {modal}
            transparent = {true}>
                <View style={styles.modal}>
                    <View style={styles.modalContent}> 
                          <TouchableOpacity  style={{ alignSelf: 'flex-end'}}
                                onPress={() => { 
                                  showModal(!modal), 
                                  updateTimeRange(null)
                                  updateButtonText("Time Range")
                                }}>
                            <Image style={[styles.icon, {width: 40, height: 40}]}
                               source = {require('./close_icon.png')}/>
                          </TouchableOpacity>
                        <TextInput  
                            style={styles.inputField}
                            autoFocus={true} 
                            placeholder='Enter your goal' 
                            onPressIn={()=>{console.log("input")}}
                            onChangeText = {enteredText => {
                              updateText(enteredText)
                            }}                   
                            required
                            multiline={false} />                                     
                        <SelectDropdown data = {rangeData}
                            defaultButtonText = {buttonText}
                            buttonStyle = {styles.button}
                            dropdownStyle = {styles.dropdown}
                            dropdownIconPosition = "left"
                            // onFocus={()=> {updateDatePicker(false)}}
                            onSelect = {(selectedItem) => {
                              updateTimeRange(selectedItem)
                              updateButtonText('Time Range')
                            }}
                            buttonTextAfterSelection = {(selectedItem) => {return selectedItem}} />

                        <Text style={{fontSize: 18, alignSelf: 'center', margin: 10}}> Deadline</Text>  
                        <View style={styles.datePickerContainer}> 
                          <View style={styles.flexBox}>         
                              <View style={styles.dateBox}>
                                  <FlatList 
                                      data={datesArray()}
                                      numColumns={1}
                                      renderItem={({item}) =>
                                        <TouchableOpacity 
                                            style={ styles.itemCell }
                                            key={item.id}
                                            onPress={() => {updateDate(item.date)}}>
                                            <Text style={selectedDate == item.date ?
                                                {fontSize:20, color: 'red'} : 
                                                {color: 'black'}
                                                }>
                                              {item.date}
                                            </Text>                                      
                                        </TouchableOpacity>   
                                      }/> 
                              </View> 

                              <View style={styles.monthBox}>
                                <FlatList 
                                    data={monthsArray}
                                    numColumns={1}
                                    renderItem={({item}) =>
                                        <TouchableOpacity   
                                            style={styles.itemCell}
                                            key={item.id}
                                            onPress={() => {updateMonth(item.month)}}>  
                                              <Text style={selectedMonth == item.month ?
                                                  {fontSize:20, color: 'red'} : 
                                                  {color: 'black'}
                                              }>
                                            {item.month}</Text>               
                                        </TouchableOpacity>   
                                    }/>         
                              </View> 
                
                              <View style={styles.yearBox}>
                                  <FlatList 
                                      data={yearsArray()}
                                      numColumns={1}
                                      renderItem={({item}) =>
                                          <TouchableOpacity   
                                              style={styles.itemCell}
                                              key={item.id}
                                              onPress={() => {updateYear(item.year)}}>      
                                                <Text style={selectedYear == item.year ?
                                                    {fontSize:20, color: 'red'} : 
                                                    {color: 'black'}
                                                }>
                                              {item.year}</Text>                      
                                          </TouchableOpacity>   
                                      }/>         
                              </View> 
                          </View> 
                        </View>
                        <TouchableOpacity  onPress={() => {addGoal()}} >
                            <Image 
                                style={styles.icon}
                                source = {require('./ok_icon.png')}
                            /> 
                            {/* image should be in the same folder, no need to import file at the top */}
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
  itemBox:{
    flex:2,
    width: '100%',
    borderWidth: 2,
    borderColor: 'green', 
    alignItems: 'center'
  }, 
  newGoal:{
    fontWeight: 'bold',
    color: 'blue', 
   },
  modal: {
    flex:1,
    backgroundColor: 'rgba(100, 100, 100, 0.6)', // 0.6 represents opacity(from 0 to 1)
    justifyContent: 'center'
  },
  modalContent:{
    backgroundColor: 'white',
    margin: '10%',
    padding: '5%',
    paddingTop: '1%',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'grey'
  }, 
  closeIcon: {
    //alignSelf: 'flex-end',
    padding: 7,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'grey',
    color: 'red'
  },
  button:{
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: "white",
    borderRadius:8,
    width: '100%',
    height:55, 
    padding: 15, 
    marginTop: 15,
    alignItems: 'center'                      
  },
  dropdown:{
    flex:1,
    borderRadius:8,
    alignSelf: 'flex-start'
  },
  inputField:{
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor:"white",
    borderRadius:8,
    height:55, 
    padding: 10, 
    fontSize: 20 
  },
  flexBoxErrorMessage:{
    flex:1,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    paddingBottom: '3%',
  },
  datePickerContainer:{
    height: 100
  },
  flexBox: {
    flex:1,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    //marginBottom: '10%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5
  },
  
  dateBox:{
    padding:0,
    width:'20%'
  },
  yearBox:{
    padding: 0,
    width:'20%',
  },
  monthBox:{
    padding: 0,
    width:'60%',
  },
  itemCell:{
    backgroundColor: 'white',
    width: '100%',
    alignItems: "center"
  },
  text: {
     alignSelf: 'center' 
  },
  icon: {
    width: 70,                                      
    height: 70,
    borderWidth: 1,
    borderRadius: 50, 
    borderColor: 'silver',
    alignSelf: 'center',
    marginTop:10,  
}
});

