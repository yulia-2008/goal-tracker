import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Image, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedbackBase, ScrollView } from 'react-native';

import { Feather } from '@expo/vector-icons';

export default function Goal({navigation, route}) {
 
    const goalObject = route.params.goalObject;
    styles.text
    const [calendarData, updateCalendarData] = useState(goalObject.calendar)
    const [currentMonth, setCurrentMonth] = useState(null)
    const [cellModal, showCellModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [currentCell, updateCurrentCell] = useState(null) 
   
    useEffect(() => {getCurrentMonth()},[])
        
    const monthArray = ["January","February","March","April","May","June","July",
                      "August","September","October","November","December"]
    const weekDays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]

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

    const defineBackgroundColor = (done) => { 
        //finds if goal marked as done on this date 
        let color;
        done ? color = goalObject.color : color = 'white'      
        return color
    }

    const defineBorderStyle = (note) => { 
        // borderStyle is different if a day has a note 
        // borderStyle works only with borderRadius  
        let borderStyle;
        note.trim() != "" ? borderStyle = 'solid' : borderStyle = 'dotted'
        return borderStyle  
    }

    const editNote = (text) => {  
        // updateting calendarData and go to HomeScreen for updating Async Storage 
        let newCalendarData = [...calendarData] // spread operator makes React see that variable has been changed
        newCalendarData[currentMonth].dates[currentCell.id].note = text              
        updateCalendarData(newCalendarData)
        route.params.editCellHandler(newCalendarData, goalObject.id)
    }
    const isGoalDone = (value) => {
        // invoking by changing switch 
        // updateting calendarData and go to HomeScreen for updating Async Storage 
        let newCalendarData = [...calendarData] // spread operator makes React see that variable has been changed
        newCalendarData[currentMonth].dates[currentCell.id].done = value           
        updateCalendarData(newCalendarData)
        route.params.editCellHandler(newCalendarData, goalObject.id)     
    }

    return (
        <View style={styles.container}> 
        {/* {console.log('in goal - goal obj', goalObject.calendar)} */}
                {calendarData && currentMonth ?
                    <>
                    <View style = {styles.buttonContainer}>
                        <Text style={{alignSelf: 'flex-end'}}> &nbsp; &nbsp; Deadline</Text> 
                        <Text style = {{alignSelf: 'flex-end'}}> Pereodicity &nbsp; &nbsp; </Text>
                    </View>
                    <View style = {styles.buttonContainer}>
                        <Text style = {styles.buttons}>{goalObject.goal.deadline.month}/{goalObject.goal.deadline.date}/{goalObject.goal.deadline.year} </Text>
                        <TouchableOpacity 
                            style = {[styles.arrowButton,{backgroundColor: goalObject.color}]}
                            onPress = {()=> setCurrentMonth(currentMonth-1)}>
                            <Feather name="chevrons-up" size={40} color="black" />
                        </TouchableOpacity>
                        <Text style = {styles.buttons}>  {goalObject.goal.timeRange}</Text>
                    </View>
                    
                    <View style = {styles.calendarContainer}>
                        <Text style = {[styles.month, 
                                        {backgroundColor: goalObject.color}
                                    ]}>
                            {calendarData[currentMonth].month} - {calendarData[currentMonth].year}
                        </Text>  
                                
                        <View style={styles.calendarHeader}>
                            { weekDays.map((item, index) => {
                                return  <TouchableOpacity style={[styles.weekDayBox, {backgroundColor: goalObject.color}]} 
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
                                    style={[styles.date, {backgroundColor: defineBackgroundColor(dateObj.done),
                                                          borderStyle: defineBorderStyle(dateObj.note)
                                                         }
                                    ]}
                                    onPress={() => {
                                        showCellModal(true)
                                        updateCurrentCell(dateObj) 
                                    }}>
                                    <Text style = {styles.textCell}>
                                        {dateObj.date}
                                    </Text>
                                
                                </TouchableOpacity>
                                : 
                                <TouchableOpacity   // render empty date cell
                                    key = {dateObj.id} 
                                    style={styles.emptyDate}>
                                    <Text style = {styles.textCell}>
                                        {dateObj.date}
                                    </Text> 
                                </TouchableOpacity>
                            })}
                        </View> 
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style = {styles.buttons}
                            onPress={()=>{
                                navigation.navigate("HomeScreen")
                                route.params.editGoalHandler(goalObject)}}>
                            <Text style={styles.buttonText}> 
                                Edit goal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style = {[styles.arrowButton,{backgroundColor: goalObject.color}]}
                            onPress = {()=> setCurrentMonth(currentMonth+1)}>
                        <Feather name="chevrons-down" size={40} color="black" />
                        </TouchableOpacity> 
                        <TouchableOpacity 
                            style = {styles.buttons}
                            onPress={()=>showDeleteModal(!deleteModal)}> 
                            <Text style={styles.buttonText}> 
                                Delete Goal 
                            </Text>
                        </TouchableOpacity>                       
                    </View>   
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
                            
                            <View style = {styles.row}>
                                <Text >Not Done</Text>
                                <Switch 
                                    onValueChange={value=> {isGoalDone(value)}}
                                    style = {{transform: [{ scaleX: 2 }, { scaleY: 2 }], margin: 40}}
                                    value = {currentCell? currentCell.done : false}
                                    trackColor={{false: 'rgb(224, 224, 224)', true: 'yellow'}}
                                    thumbColor='grey'                                  
                                />
                                <Text >Done</Text>                              
                            </View>

                            <TextInput  
                                style={styles.inputField}
                                autoFocus={true} 
                                placeholder='enter note'
                                onChangeText = {enteredText => {editNote(enteredText)}}                   
                                multiline={true}  
                                value = {currentCell? currentCell.note : null}
                            />       
                        </View>
                    </View>
                </Modal>     
           
            <Modal 
                transparent = {true} 
                visible = {deleteModal}>
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity  
                            onPress={() => showDeleteModal(false)}
                            style={{ alignSelf: 'flex-end'}}>
                            <Image   
                                style={{width: 40, height: 40}}
                                source = {require('./close_icon.png')}/>
                        </TouchableOpacity>        
                        <Text> This action permanetly delete current goal</Text>
                        <TouchableOpacity
                            onPress={() => { 
                                //showDeleteModal(false)           
                                navigation.navigate("HomeScreen")
                                route.params.deleteHandler(goalObject.id)
                                }}>
                            <Image 
                                style={styles.icon}
                                source = {require('./ok_icon.png')}/>         
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
        borderWidth:3,
        paddingHorizontal: '5%',
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    goalInfoText:{
        fontSize: 18,
    },
    calendarContainer: { // include header and dated (without arrows)
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 25,
        paddingVertical: 9,
        marginVertical: 20,
        backgroundColor: 'rgb(224, 224, 224)',
        
    },
    calendarHeader:{ //weekdays
        justifyContent: 'space-around', // horizontally
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        // borderWidth: 2,
        // borderColor: "red",
        alignItems: 'stretch'
    },
    weekDayBox:{
        width: '13%',
        height: 40,
        borderWidth: 1,
        borderRadius: 13,
        borderColor: "grey",
        padding: 6,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center', // vertically

    },
    month: {
        width: '60%',
        padding: '3%',
        margin: 5,
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        borderWidth: 1,
        borderRadius: 13,
        borderColor: "grey",
    },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50
    },
    buttons:{
        borderWidth: 1, 
        borderRadius: 15, 
        borderColor: 'grey', 
       // width: '40%',
        padding: 10,
        fontSize: 18, // remove it if change for touchableopacity on top
    },
    arrowButton: {
        alignItems: 'center', 
        alignSelf: 'center', 
        borderWidth: 1, 
        borderRadius: 15, 
        borderColor: 'grey', 
        width: '13%',   
    },
    datesBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
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
        borderRadius: 13
    },
    emptyDate:{
        alignItems: 'center',   // gorizontally
        padding: 11,         // it is not 10 because there is no border
        margin: 2,
        marginTop: 8,
        marginBottom: 8,
        flexBasis: '13%'
    },
    textCell: { // does it affect?
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
    inputField:{
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius:8,
        height:100, 
        padding: 10, 
        fontSize: 20 
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