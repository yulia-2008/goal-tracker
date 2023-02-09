import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback,
         Keyboard, FlatList, Modal} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 



export default function HomeScreen({navigation, route}) {

  const monthArray = ["Jan","Feb","Mar","Apr","May","June","July",
                      "Aug","Sep","Oct","Nov","Dec"]

  const [goalsData, updateGoals] = useState(null)   
  const [currentGoalId, setCurrentGoalId] = useState(null) // after clicking on item, state keeps it's id
  const [text, updateText] = useState("")
  const [modal, showModal] = useState(false)
  
  useEffect(() => {getData()}, [])

  const generateInitialCalendar = () => { 
      // creates nested array [ { id: 0, 
      //                         month: 'january',
      //                         year: 2020, 
      //                         dates: [{id: 0, date: 1, done: true, note: "str"},
      //                                 {id: 1, date 2, done: false, note: "str"},...                                          
      //                                ]
      //                         },
      //                         {...},{...},{...}
      //                       ]
    let dataArray = []
    let count = 0;
    for (let i = 2022; i <= 2024; i ++){      
        monthArray.map(mo => {
            dataArray.push({id: count, month: mo, year: i, dates: getDates(monthArray.indexOf(mo), i)})
            count += 1
        })
    }  
    return dataArray
  }

  const getDates = (month, year) => {
        // function created array in next format :
      // [{id: 0, date: 1, done: false, note: ''}, {id: 1, date: 2, done: false, note: ''},...]
      let daysCount = new Date(year, month, 0).getDate();  
              // third parameter represents date (1-31), 
              // if it's 0  ---> output will be the last day of the previos month (30 or 31)
              // so getDate() return 30 or 31,               
              // Months start with index 0, so the previous month is the needed month 

      let firstDay = new Date(year, month, 1).getDay()  // (day of the week  --> 0-6)
      let daysArray = [];
      let daysArrayWithKeys = []  

      for (let i = 1; i <= daysCount; i++) {
          daysArray.push(i);
      }
      switch (firstDay) {
          // If the 1st day of the month starts not on Monday 
          // push "" to the begining of the daysArray 
          case 0:
              daysArray.unshift("", "", "", "", "", "");
              break;
          case 2:
              daysArray.unshift("");
              break;
          case 3:
              daysArray.unshift("", "");
              break;
          case 4:
              daysArray.unshift("", "", "");
              break;
          case 5:
              daysArray.unshift("", "", "", "");
              break;
          case 6:
              daysArray.unshift("", "", "", "", "");               
          }
          for(var i = 0; i <= daysArray.length-1; i++){
              daysArrayWithKeys.push({
                  id: i, 
                  date: daysArray[i],
                  done: false,
                  note: ''
                  });
          }         
    return daysArrayWithKeys
  }

  const initialGoalData = [
    {goal: false, id: 1, color: 'rgb(255, 204, 204)', calendar: generateInitialCalendar()},
    {goal: false, id: 2, color: 'rgb(255, 255, 204)', calendar: generateInitialCalendar()},
    {goal: false, id: 3, color: 'rgb(204, 255, 204)', calendar: generateInitialCalendar()},
    {goal: false, id: 4, color: 'rgb(204, 255, 255)', calendar: generateInitialCalendar()},
    {goal: false, id: 5, color: 'rgb(255, 204, 229)', calendar: generateInitialCalendar()},
    {goal: false, id: 6, color: 'rgb(229, 255, 204)', calendar: generateInitialCalendar()},
    {goal: false, id: 7, color: 'rgb(176, 196, 222)', calendar: generateInitialCalendar()},
    {goal: false, id: 8, color: 'rgb(229, 204, 255)', calendar: generateInitialCalendar()},
    {goal: false, id: 9, color: 'rgb(172, 252, 252)', calendar: generateInitialCalendar()},
    {goal: false, id: 10, color: 'rgb(244, 164, 96)', calendar: generateInitialCalendar()},
    {goal: false, id: 11, color: 'rgb(238, 232, 170)', calendar: generateInitialCalendar()},
    {goal: false, id: 12, color: 'rgb(216, 191, 216)', calendar: generateInitialCalendar()}
  ]
 
  let getData = async () =>  {
    let keys = await AsyncStorage.getAllKeys()
    if (keys.includes('storedData')){
       await AsyncStorage.getItem('storedData')
       .then(data => JSON.parse(data))
       .then(data => {updateGoals(data)
       })
    }
    else {updateGoals(initialGoalData)}
  }

  let addGoal = () => {
    // chek if input is filled, create newGoalObject
    if (text.trim() != "" ){ 
      let newGoal = { 
        text: text,
        timeRange: null,  
        deadline: {}      
      }
      let goals = [...goalsData]
      goals[currentGoalId-1].goal = newGoal  // state itemId-1 == goal's index in goalData array
      updateGoals(goals)
      AsyncStorage.setItem("storedData", JSON.stringify(goals)) 
      showModal(!modal)    // closing Modal
      updateText("")      // clearing entered data 
    
      // navigation.navigate("Goal", {  // maybe need it later !!!
      //   goalObject: goalsData[currentGoalId-1], 
      //   deleteHandler: deleteGoal, 
      //   editCellHandler: editCell,
      //   editGoalHandler: editGoal
      // }) 
    }  
  }

  const deleteGoal = (goalId) => {
      //update goals in state and AsyncStorage 
    let newGoalsData = [...goalsData] //spread operator need for React recognized that array has been changed
    let foundGoal = newGoalsData[goalId-1]
    foundGoal.goal = false
    foundGoal.calendar = generateInitialCalendar()
    updateGoals(newGoalsData)
    AsyncStorage.setItem("storedData", JSON.stringify(newGoalsData))   
  }

  const editCell = (updatedCalendarData, goalId)  => {
    // invoke by editCellHandler - a prop for GoalScreen
    // edit switch value and note
    let newGoalsData = [...goalsData]
    let foundGoal = newGoalsData[goalId-1]
    foundGoal.calendar = updatedCalendarData
    AsyncStorage.setItem("storedData", JSON.stringify(newGoalsData))
  }

  const editGoal = (updatedGoalObject) => {
    let newGoalsData = [...goalsData]
    newGoalsData[updatedGoalObject.id-1] = updatedGoalObject
    AsyncStorage.setItem("storedData", JSON.stringify(newGoalsData))
  }

  const getWidth = (gId) => {
    let width;
    let dimentions = [0, 200, 150, 100, 240, 130, 200, 250, 90, 110, 230, 200, 150]
    width = dimentions[gId]
    return width
  }

  const getHeight = (gId) => {
    let height;
    let dimentions = [0, 100, 100, 90, 100, 130, 110, 100, 110, 110, 110, 130, 100, 100]
    height = dimentions[gId]
    return height
  }
  
  const getMargin = (id) => {
    let margin;
    let number = [0, 5, 5, 10, 5, 5, 15, 5, 5, 1, 10, 5, 5]
    margin = number[id]
    return margin
  }

  return (
      <View style={styles.container}>
           {/* {AsyncStorage.removeItem('storedData') }     */}
        
        {/* {console.log('homescreen', goalsData)} */}
        <View style={styles.itemBox}>
          <FlatList        // render containers with goals OR empty conteiners
              data={goalsData}
              numColumns={2}
              renderItem={({item}) =>
                  <TouchableOpacity   
                      key={item.id}
                      style={ item.goal? [styles.item, {backgroundColor: item.color, margin: getMargin(item.id),
                                          width: getWidth(item.id), height: getHeight(item.id)}]:
                                         [styles.item, {backgroundColor: 'rgb(224, 224, 224)', margin: getMargin(item.id),
                                         width: getWidth(item.id), height: getHeight(item.id) }]
                      }
                      onPress={() => {
                          item.goal ?
                            navigation.navigate("Goal", {
                              goalObject: item, 
                              deleteHandler: deleteGoal, 
                              editCellHandler: editCell,
                              editGoalHandler: editGoal,
                            }):                                       
                            showModal(!modal), setCurrentGoalId(item.id)              
                      }}>
                      {item.goal?  
                        <Text style={{color: 'black'}}>{item.goal.text}</Text>:
                        <Text style={{color: 'rgb(160, 160, 160)'}}>New Goal</Text>               
                      }  
                  </TouchableOpacity>   
              }         
          /> 
        </View> 
        <Modal     
            visible = {modal}
            transparent = {true}>
                <TouchableOpacity 
                    style={styles.modal} 
                    onPress={()=>showModal(false)}>
                      <TouchableOpacity 
                          activeOpacity={1} // disable highlighting effect
                          style={styles.modalContent}
                          onPress={e => {// do not close modal if anything inside modal content is clicked
                              e.stopPropagation()
                          }}> 
                          {/* <TouchableOpacity /////!!!!! MAY BE NEED IT LATER
                                style={styles.closeIcon}
                                onPress={() => { 
                                  showModal(!modal) 
                                  updateText('')
                                }}>
                            <AntDesign name="close" size={35} color="black" />
                          </TouchableOpacity> */}
                        <TextInput  
                            style={styles.inputField}
                            autoFocus={true} 
                            placeholder = 'Enter your goal'
                            value = {text}
                            onChangeText = {enteredText => {updateText(enteredText)}}                   
                            required
                            multiline={true} />                                     
                        
                        <TouchableOpacity 
                          style = {styles.okIcon} 
                          onPress={() => {addGoal()}} >
                          <AntDesign name="check" size={40} color="black" />
                        </TouchableOpacity>
                      </TouchableOpacity>
              </TouchableOpacity> 
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
    //justifyContent: 'space-between', 
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderRadius: 25, 
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemBox:{
    flex: 1, // does it affect?
    width: '100%',
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
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '85%',
    paddingVertical: '4%',
    paddingHorizontal: '2%',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'grey',
    alignSelf: 'center',
    justifyContent: 'space-around'
  }, 
  inputField:{
    width: '75%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    height: 50, 
    padding: 10, 
    fontSize: 20
  },
  text: {
    alignSelf: 'center' 
  },
  closeIcon:{
    alignSelf: 'flex-end', 
    backgroundColor: 'rgba(255, 57, 57, 0.6)',
    borderWidth: 3,
    borderRadius: 13,
    marginVertical: 10
  }, 
  okIcon:{
    //alignSelf: 'flex-end', 
    backgroundColor: 'rgb(84, 201, 107)',
    borderWidth: 3,
    borderRadius: 13,
    //marginVertical: 10
  }
});

