import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, 
         FlatList, Modal} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 



export default function HomeScreen({navigation, route}) {

  const monthArray = ["Jan","Feb","Mar","Apr","May","June","July",
                      "Aug","Sep","Oct","Nov","Dec"]

  const [goalsData, updateGoals] = useState(null)   
  const [currentGoalId, setCurrentGoalId] = useState(null) // after clicking on item, state keeps it's id
  const [text, updateText] = useState("")
  const [modal, showModal] = useState(false)
  
  useEffect(() => {getData()}, [])
  let dateId = 1

  const generateInitialCalendar = () => { 
      // creates nested array [ { id: 0, 
      //                         month: 'january',
      //                         year: 2020, 
      //                         dates: [{id: 1, date: 1, done: true, note: "str"},
      //                                 {id: 2, date 2, done: false, note: "str"},...                                          
      //                                ]
      //                         },
      //                         {...},{...},{...}
      //                       ]
    let dataArray = []
    let count = 0;
    for (let i = 2023; i <= 2034; i ++){      
        monthArray.map(mo => {
            dataArray.push({id: count, month: mo, year: i, dates: getDates(monthArray.indexOf(mo), i)})
            count += 1
        })
    } 
    dateId=1 // for the new goal object --> dates id starts with 1
    return dataArray
  }

  const getDates = (month, year) => {
        // function created array in next format :
      // [{id: 0, date: 1, done: false, note: ''}, {id: 1, date: 2, done: false, note: ''},...]
      let daysCount = new Date(year, month+1, 0).getDate();  
              // third parameter represents date (1-31), 
              // if it's 0  ---> output will be the last day of the previos month (30 or 31)
              // so getDate() return 30 or 31,               
              // Months start with index 0, so the previous month is the needed month 
      let prevMonth = new Date(year, month, 0).getDate();
      //let nextMonth = new Date(year, month+1, 1).getDate();  
      let firstDay = new Date(year, month, 1).getDay()  // (day of the week  --> 0-6 (0 is sunday))
      let lastDay = new Date(year, month, daysCount).getDay()
      let daysArray = [];
      let daysArrayWithKeys = []  

      for (let i = 1; i <= daysCount; i++) {
          daysArray.push(i);
      }
      switch (firstDay) {
          // If the 1st day of the month not on Monday 
          // push prev. month dates as a string to the begining of the daysArray 
          case 0:
              daysArray.unshift(`${prevMonth-5}`, `${prevMonth-4}`, `${prevMonth-3}`, `${prevMonth-2}`, `${prevMonth-1}`, `${prevMonth}`);
              break;
          case 2:
              daysArray.unshift(`${prevMonth}`);
              break;
          case 3:
              daysArray.unshift(`${prevMonth-1}`, `${prevMonth}`);
              break;
          case 4:
              daysArray.unshift(`${prevMonth-2}`, `${prevMonth-1}`, `${prevMonth}`);
              break;
          case 5:
              daysArray.unshift(`${prevMonth-3}`, `${prevMonth-2}`, `${prevMonth-1}`, `${prevMonth}`);
              break;
          case 6:
              daysArray.unshift(`${prevMonth-4}`, `${prevMonth-3}`, `${prevMonth-2}`, `${prevMonth-1}`, `${prevMonth}`);               
            }

          switch (lastDay) {
            // if the last day of the month not on saturday
            // push next month dates as string to the end of the array
            case 1:
              daysArray.push('1', '2', '3', '4', '5', '6')
              break;
            case 2:
              daysArray.push('1', '2', '3', '4', '5')
              break;
            case 3:
              daysArray.push('1', '2', '3', '4')
              break;
            case 4:
              daysArray.push('1', '2', '3')
              break;
            case 5:
              daysArray.push('1', '2')
              break;
            case 6:
              daysArray.push('1')
          }    
            

          for(var i = 0; i <= daysArray.length-1; i++){
              daysArrayWithKeys.push({
                  id: dateId, 
                  date: daysArray[i],
                  done: false,
                  note: ''
                  });
          dateId += 1    // date id is increasing tru all goal calendar     
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
    {goal: false, id: 7, color: 'rgb(229, 241, 255)', calendar: generateInitialCalendar()},
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
        timeRange: '- -',  
        deadline: {month: '--', date: '--', year: '--', dateId: null},
        startDate: {month: '--', date: '--', year: '--', dateId: null}     
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

    if(foundGoal.goal.text.includes('COMPLETED')){ // deleted completed goal
      newGoalsData = newGoalsData.filter(obj => obj.id !== goalId)     
    }
    else{ // clear info in goal 
      foundGoal.goal = false
      foundGoal.calendar = generateInitialCalendar()
    }  
    updateGoals(newGoalsData)
    AsyncStorage.setItem("storedData", JSON.stringify(newGoalsData))    
  }

  const moveGoal = (goalObj) => {
      // creates new item in the end of list - completed goal
    goalObj.goal.text = `COMPLETED \n${goalObj.goal.text}`
    let newGoalsData = [...goalsData]
    newGoalsData.push({goal: goalObj.goal, id: newGoalsData.length+1, color: 'rgb(170, 170, 170)', calendar: goalObj.calendar})
      // clear goal info
    let goalForDeletion = newGoalsData[goalObj.id-1]
    goalForDeletion.goal = false
    goalForDeletion.calendar = generateInitialCalendar()
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

  const getWidth = (id) => {
    let width;
    let dimentions = [0, 200, 150, 100, 240, 130, 200, 250, 90, 110, 230]
    if (id <= 10){
      width = dimentions[id]
    } 
    else{
      let str  = String(id)
      let num = Number(str[str.length-1])
      width = dimentions[num]
    }
    return width
  }

  const getHeight = (id) => {
    let height;
    let dimentions = [0, 100, 100, 90, 100, 130, 110, 100, 110, 110, 110]
    if (id <= 10){
      height = dimentions[id]
    } 
    else{
      let str  = String(id)
      let num = Number(str[str.length-1])
      height = dimentions[num]
    }
    return height
  }
  
  const getMargin = (id) => {
    let margin;
    let dimentions = [0, 5, 5, 10, 5, 5, 15, 5, 5, 1, 10]
    if (id <= 10){
      margin = dimentions[id]
    } 
    else{
      let str  = String(id)
      let num = Number(str[str.length-1])
      margin = dimentions[num]
    }
    return margin
  }

  return (
      <View style={styles.container}>
        {/* {AsyncStorage.removeItem('storedData') }     */}
          {/* {console.log(goalsData[0].calendar[1])}  */}
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
                              moveGoalHandler: moveGoal
                            }):                                       
                            showModal(!modal), setCurrentGoalId(item.id)              
                      }}>
                      {item.goal?  
                        <>
                          <Text style={{color: 'black'}}>{item.goal.text}{item.id}</Text>
                          <Text>50%</Text>  
                        </>:
                        <Text style={{color: 'rgb(160, 160, 160)'}}>New Goal {item.id}</Text>               
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
    borderBottomWidth: 4,
    borderRightWidth: 4, 
    borderRadius: 25, 
    borderColor:'rgb(160, 160, 160)',
    //borderColor: 'grey',
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

