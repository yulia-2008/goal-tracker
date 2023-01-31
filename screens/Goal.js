import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Image, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedbackBase, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import Switch from '@mui/material/Switch';
//import { Switch } from '@material-ui/core';

export default function Goal({navigation, route}) {

    const goalObject = route.params.goalObject;
    
    const [calendarData, updateCalendarData] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)
    const [cellModal, showCellModal] = useState(false)
    const [currentCell, updateCurrentCell] = useState(null) 
    const [switchValue, updateSwitch] = useState(null);
   
    useEffect(() => getData(), [])
    useEffect(() => {calendarData? getCurrentMonth(): console.log('loading')},[calendarData])
    useEffect(() => {currentCell? getSwitchValue(): console.log('no cell')}, [currentCell])
    
    const monthArray = ["January","February","March","April","May","June","July",
                      "August","September","October","November","December"]
    const weekDays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]

    let getData = async () =>  {
        let keys = await AsyncStorage.getAllKeys()
        if(keys.includes('storedCalendar')){
            await AsyncStorage.getItem('storedCalendar')
            .then(data => JSON.parse(data))
            .then(data => {updateCalendarData(data), console.log('from storage' )
            })
        }
        else {
            generateInitialCalendar(), console.log('generated')
            //AsyncStorage.setItem("storedCalendar", JSON.stringify(calendarData))
             //?? do I need to store it now or after chenging data
        }
    }

    const generateInitialCalendar = () => {
    // creates nested array [ { id: 0, 
    //                         month: 'january',
    //                         year: 2020, 
    //                         dates: [{id: 0, date: 1, hasGoals:[{goalId: 2, done: true, note: "str"},
    //                                                            {goalId: 3, done: false, note: "str"}                                          
    //                                                             ] 
    //                                 {id: 1, date: 2, hasGoals: []}, ...
    //                                ]
    //                         },{...},{...},{...}
    //                       ]
        let dataArray = []
        let count = 0;
        for (let i = 2022; i <= 2024; i ++){      
            monthArray.map(mo => {
                dataArray.push({id: count, month: mo, year: i, dates: getDates(monthArray.indexOf(mo), i)})
                count += 1
            })
        }  
        updateCalendarData(dataArray) 
    }

    const getDates = (month, year) => {
         // function created array in next format :
        // [{id: 0, date: 1, color: 'white'}, {id: 1, date: 2, color: 'white'},...]
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
                    hasGoals: []
                    });
            }          
      return daysArrayWithKeys
    }

    const getCurrentMonth = () => {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() // output 0 to 11
        let currentMo = calendarData.find( 
                obj => obj.month === monthArray[currentMonth]
                && obj.year === currentYear    
        )  
        setCurrentMonth(currentMo.id)      
    }

    const editCell = () => { // mess here
        let newCalendarData = calendarData
        let hasGoalsArray = newCalendarData[currentMonth].dates[currentCell.id].hasGoals
        let foundObj = hasGoalsArray.find(obj => obj.goalId == goalObject.id)
        if(foundObj){
            foundObj.done = !foundObj.done   // if has goal
            console.log('in edit cell - if found id', switchValue )
        }
        else{ // if does not have goal or []
            hasGoalsArray.push({goalId: goalObject.id, done: !switchValue})  
            console.log('in edit cell - if dont found id', switchValue )
        }            
        updateCalendarData(newCalendarData)
        AsyncStorage.setItem("storedCalendar", JSON.stringify(newCalendarData))        
    }

    const defineColor = (dateObj) => { // does not work properly!
        //console.log('define color dateObj',dateObj.hasGoals)
        //finds if goal's id is in hasGoals array
         let color = 'white'
        if (dateObj.hasGoals.length > 0){
           let found = dateObj.hasGoals.find(obj => obj.goalId === goalObject.id)
           if(found && found.done){ 
            color = goalObject.color                    
           }
           else{
             color = 'white'
  
            }                 
        }
        return color
    }

    const getSwitchValue = () => { // work 
            let found = currentCell.hasGoals.find(obj => obj.goalId == goalObject.id)

            found? updateSwitch(found.done) : updateSwitch(false)
            // if did not find - ufound is undefined => false value
        console.log('found done', Boolean(found))
        console.log('in get SwitchValue, bul', Boolean(currentCell.hasGoals))
        console.log('in get SwitchValue, []', currentCell.hasGoals)
    }

    

    return (
        <View style={styles.container}>  
            <Text> Deadline: {goalObject.goal.deadline.month} / {goalObject.goal.deadline.date} / {goalObject.goal.deadline.year} </Text>
            <Text> Pereodicity: {goalObject.goal.timeRange} </Text>
            <View style={styles.calendarBox}>
                {calendarData && currentMonth ?
                    <>
                    <TouchableOpacity onPress = {()=> setCurrentMonth(currentMonth-1)}>
                        <Text>previos month</Text>
                    </TouchableOpacity>

                    <Text style = {styles.month}>{calendarData[currentMonth].month} - {calendarData[currentMonth].year}</Text>            
                    <View style={styles.calendarHeader}>
                        { weekDays.map((item, index) => {
                            return  <TouchableOpacity style={styles.weekDayBox} 
                                                      key={index}>
                                        <Text>{item}</Text>
                                    </TouchableOpacity> 
                        })}   
                    </View> 
             
                    <View style = {styles.datesBox}>
                        {calendarData[currentMonth].dates.map(dateObj => {
                            return typeof dateObj.date == 'number' ?
                            <TouchableOpacity   // render date cell
                                key = {dateObj.id} 
                                style={[styles.date, {backgroundColor: defineColor(dateObj)}]}
                                onPress={() => {
                                    showCellModal(true)
                                    updateCurrentCell(dateObj) 
                                    console.log("in onPress cell", dateObj.hasGoals)
                                    //getSwitchValue()  does not work here
                                }}>
                                <Text style = {styles.text}>
                                    {dateObj.date}
                                </Text>
                            
                            </TouchableOpacity>
                            : 
                            <TouchableOpacity   // render empty date cell
                                key = {dateObj.id} 
                                style={styles.emptyDate}>
                                <Text style = {styles.text}>
                                    {dateObj.date}
                                </Text> 
                            </TouchableOpacity>
                        })}
                    </View> 
                    <TouchableOpacity onPress = {()=> setCurrentMonth(currentMonth+1)}>
                        <Text>Next Month</Text>
                    </TouchableOpacity>
                    </>:
                    <Text>Loading</Text>
                }                         
                <Modal 
                    transparent = {true} 
                    visible = {cellModal}>
                    <View style={styles.modal}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity  
                                style={{ alignSelf: 'flex-end'}}
                                onPress={() => { 
                                    showCellModal(false)
                                }}>
                                <Image style={{width: 40, height: 40}}
                                       source = {require('./close_icon.png')}/>
                            </TouchableOpacity>
                            {/* <Text style={styles.buttonText}>Is goal acomplished for this day?</Text> */}
                            
                            <View style = {styles.row}>
                                <Text >Not Done</Text>
                                <Switch 
                                    onValueChange={()=> {
                                        //getSwitchValue() ??
                                        updateSwitch(!switchValue) 
                                        editCell()
                                    }}
                                    style = {{transform: [{ scaleX: 2 }, { scaleY: 2 }], margin: 40}}
                                    value = {switchValue} //??
                                    trackColor={{false: 'rgb(224, 224, 224)', true: 'yellow'}}
                                    thumbColor={switchValue ? 'grey' : 'grey'}                                   
                                />
                                <Text >Done</Text>
                                
                            </View>
<Text>{console.log('Text',switchValue)}</Text>
                            <TextInput  
                                //style={styles.inputField}
                                autoFocus={true} 
                                placeholder='Notes for this day' 
                                onPressIn={()=>{console.log("input2")}}
                                onChangeText = {enteredText => {
                                    updateText(enteredText)
                                }}                   
                            required
                            multiline={true} />       

                            {/* <View style={styles.row}>
                                <TouchableOpacity 
                                    style={styles.button}                            
                                    onPress = {()=> {
                                        showCellModal(false)
                                        //markThisCell()
                                        }}>
                                    <Text style={styles.buttonText}>YES</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.button}                                         
                                    onPress = {()=> {
                                        showCellModal(false)

                                    }}>
                                    <Text style={styles.buttonText}>NO</Text>
                                </TouchableOpacity>                               
                            </View>    */}
                        </View>
                    </View>
                </Modal>     
            </View>                                            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth:3,
        padding: 10,
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    calendarBox: {
        flex:1,
        width: '90%',
        margin: '5%',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: "grey",
        borderRadius: 5
    },
    calendarHeader:{
        justifyContent: 'space-around', // gorizontally
        width: '100%',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: "red",
        alignItems: 'stretch'
    },
    weekDayBox:{
        width: '14%',
        borderWidth: 2,
        borderColor: "blue",
        padding: '2%',
        alignItems: 'center'
    },
    month: {
        width: '100%',
        padding: '4%',
        textAlign: 'center',
        fontWeight: 'bold',
        borderWidth: 2,
        borderColor: "blue",
    },
    datesBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 2,
        borderColor: "pink",
    }, 
    date: {
        alignItems: 'center',   // gorizontally
        padding: 10,         
        margin: 2,
        marginTop: 8,
        marginBottom: 8,
        flexBasis: '13%',    // flexBasis for child,  flexWrap for parent  => grid!!!
        borderWidth: 2,
        borderColor: "grey",
    },
    emptyDate:{
        alignItems: 'center',   // gorizontally
        padding: 10,         
        margin: 2,
        marginTop: 8,
        marginBottom: 8,
        flexBasis: '13%'
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    button:{
        width: "40%",
        borderWidth: 2,
        borderBottomWidth: 4,
        borderRightWidth: 4, 
        borderColor: 'rgb(104, 149, 197)',
        backgroundColor:"yellow",
        borderRadius:8,
        padding: 10,
        alignSelf: 'center'
        },
    buttonText: {
        fontSize: 18,
        alignSelf: 'center'
    },
    modal: {
            flex:1,
            backgroundColor: 'rgba(100, 100, 100, 0.1)', // 0.1 represents opacity
            justifyContent:'center'       
        },
    modalContent:{
        backgroundColor: 'white',
        alignSelf: 'center',
        margin: 20,
        padding: 20,
        
        //borderRadius: 10
    },
    row: {
        paddingHorizontal: 10,
        flexDirection: 'row', 
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    
    
});