import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Image, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedbackBase, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 

export default function Goal({navigation, route}) {
 
    const goalObject = route.params.goalObject;
    const goalCompleted = goalObject.goal.text.includes('COMPLETED')
    
    const [calendarData, updateCalendarData] = useState(goalObject.calendar)
    const [currentMonth, setCurrentMonth] = useState(null)
    const [cellModal, showCellModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [deadlineModal, showDeadlineModal] = useState(false)
    const [deadlineReachedModal, showDeadlineReachedModal] = useState(false)
    const [currentCell, updateCurrentCell] = useState(null) 
    const [selectedDate, updateDate] = useState(goalObject.goal.deadline.date)
    const [selectedMonth, updateMonth] = useState(goalObject.goal.deadline.month)
    const [selectedYear, updateYear] = useState(goalObject.goal.deadline.year)
   
    useEffect(() => {getCurrentMonth(), isDeadlineReached()},[])
    useEffect(() => {console.log('cur-mo', currentMonth)},[goalObject])
        
    const monthArray = ["--", "Jan","Feb","Mar","Apr","May","June","July",
                      "Aug","Sep","Oct","Nov","Dec"]
    const weekDays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
    const rangeData = ["---" , "One time", "Every day", "Every other day",  "2 times a week",
            "3 times a week", "Every week", "Every 2 weeks", "Every month", "2 times a month"]

    const date = new Date()
    const currYear = date.getFullYear()
    const currMonth = date.getMonth() // output 0 to 11 
    const currDate = date.getDate() 

    const getCurrentMonth = () => {
        // find object id in calendarData array
        let currentMo = calendarData.find( 
                obj => obj.month === monthArray[currMonth+1]
                && obj.year === currYear    
        )  
        setCurrentMonth(currentMo.id)  
    }   
    
    const isDeadlineReached = () => {
        if(!goalObject.goal.text.includes('COMPLETED')){ 

            if((goalObject.goal.deadline.year < currYear) || 
                (goalObject.goal.deadline.year == currYear &&
                monthArray.indexOf(goalObject.goal.deadline.month) < monthArray.indexOf(monthArray[currMonth+1])
                ) ||
                (goalObject.goal.deadline.year == currYear &&
                goalObject.goal.deadline.month == monthArray[currMonth+1]&&
                goalObject.goal.deadline.date <= currDate
                )
            ){ 
                showDeadlineReachedModal(true)
            }
        } 
    }

    const datesArray = () => {
        // generates dates for goal deadline container
        // need to fix: allowed to chose dayte 31 for all months
        let array = [{id: 0, date: "--"}];
        for(let i = 1; i <= 31; i++){
          let newDate = {id: i, date: i}
          array.push(newDate);
        }
        return array
    }

    const yearsArray = () => {
        // generate years array for deadline container
        let array = [{id: 0, year: "--"}];
        let year = new Date().getFullYear()
        for(let i = year; i <= year+10; i++){
          let newYear = {id: i, year: i}
          array.push(newYear);
        }
        return array
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
    
    const updateGoalInfo = (param) => {
         // updating timeRange and deadline
        let newGoalObject = Object.assign({}, goalObject)
        if(param){// param == selectedItem // for updating timeRange
           newGoalObject.goal.timeRange = param
        }
        else{ // undefined param  -- false value -> comes from deadlineModal
            newGoalObject.goal.deadline = {date: selectedDate, month: selectedMonth, year: selectedYear}
        }
        route.params.editGoalHandler(newGoalObject)
    }

    return (
        <View style={styles.container}> 
        {/* {console.log('in goal - goal obj')} */}
                {calendarData && currentMonth ?
                    <>
                    <View style = {styles.buttonContainer}>
                        <Text style={{alignSelf: 'flex-end'}}> &nbsp; &nbsp; Deadline</Text> 
                        <Text style = {{alignSelf: 'flex-end'}}> Pereodicity &nbsp; &nbsp; </Text>
                    </View>
                    <View style = {styles.buttonContainer}>
                        <TouchableOpacity 
                            style = {styles.buttons}
                            onPress = {() => showDeadlineModal(true)}>
                            <Text style={styles.buttonText}>{goalObject.goal.deadline.month}/{goalObject.goal.deadline.date}/{goalObject.goal.deadline.year} </Text>
                         
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style = {[styles.arrowButton,{backgroundColor: goalObject.color}]}
                            onPress = {()=> setCurrentMonth(currentMonth-1)}>
                            <Feather name="chevrons-up" size={40} color="black" />
                        </TouchableOpacity>
                
                        <SelectDropdown 
                            data = {goalCompleted?
                                ['Can not change it',  'Goal is completed']:
                                rangeData
                            }
                            defaultButtonText = {goalObject.goal.timeRange} 
                            buttonStyle = {styles.buttons}
                            dropdownStyle = {styles.dropdown}
                            //rowStyle={}
                            //rowTextStyle={}                              
                            onSelect = {(selectedItem) => {
                                updateGoalInfo(selectedItem)
                                //updateTimeRange(selectedItem)
                            }}
                            buttonTextAfterSelection = {(selectedItem) => {return selectedItem}} />

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
                            // onPress={()=>{
                            //     navigation.navigate("HomeScreen")
                            //     route.params.editGoalHandler(goalObject)}}
                            >
                            <Text style={styles.buttonText}> 
                               will be % 
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
                <Modal // cellModal
                    transparent = {true} 
                    visible = {cellModal}>
                    <TouchableOpacity 
                        onPress={()=>showCellModal(false)}
                        style={styles.modal}>
                        {goalCompleted?
                            <>
                            <Text style={[styles.modalContent, {height: '10%', fontSize: 18, textAlign: 'center'}]}>
                                Can not change it. Goal is completed
                            </Text>
                            </>:
                            <TouchableOpacity 
                                activeOpacity={1} // disable highlighting effect
                                onPress={e => {// do not close modal if anything inside modal content is clicked
                                    e.stopPropagation()
                                }}
                                style={[styles.modalContent, {flexDirection: 'column', height: '40%', paddingHorizontal: '4%'}]}>
                                
                                <View style = {styles.row}>
                                    <Text >Not Done</Text>
                                    <Switch 
                                        onValueChange={value=> {isGoalDone(value)}}
                                        style = {{transform: [{ scaleX: 2 }, { scaleY: 2 }]}}
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

                                <TouchableOpacity  // Do i need this? saves automaticly
                                    style = {[styles.okIcon, {marginHorizontal: '43%'}]} 
                                    onPress={() => {           
                                        console.log('edit')
                                        }}>
                                    <AntDesign name="check" size={40} color="black" />
                                </TouchableOpacity>           
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                </Modal>     
           
            <Modal // deleteModal
                transparent = {true} 
                visible = {deleteModal}>
                <TouchableOpacity 
                    style={styles.modal} 
                    onPress={()=>showDeleteModal(false)}>
                    <TouchableOpacity 
                        activeOpacity={1} // disable highlighting effect
                        onPress={e => {// do not close modal if anything inside modal content is clicked
                            e.stopPropagation()
                        }}
                        style={styles.modalContent}>
                        <Text style = {{alignSelf: 'center', fontSize: 18}}> Permanetly delete current goal? </Text>
                        <TouchableOpacity 
                            style = {styles.okIcon} 
                            onPress={() => {           
                                navigation.navigate("HomeScreen")
                                route.params.deleteHandler(goalObject.id)
                                }}>
                            <AntDesign name="check" size={40} color="black" />
                        </TouchableOpacity>        
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            
            <Modal // deadlineModal
                transparent = {true} 
                visible = {deadlineModal}>
                <TouchableOpacity 
                    onPress={()=>{showDeadlineModal(false)}}
                    style={styles.modal}>
                    {goalCompleted?
                        <Text 
                            style={[styles.modalContent, {height: '10%', fontSize: 18, textAlign: 'center'}]}>
                                Can not change it. Goal is completed
                        </Text>   
                        :   
                        <TouchableOpacity 
                            activeOpacity={1}
                            onPress={e => {// do not close modal if anything inside modal content is clicked
                                e.stopPropagation()
                            }}
                            style={[styles.modalContent, {height: '25%'}]}>

                            <View style={styles.datePickerContainer}> 
                                    <View style={styles.datePickerColumn}>
                                        <FlatList 
                                            data={datesArray()}
                                            numColumns={1}
                                            renderItem={({item}) =>
                                            <TouchableOpacity 
                                                style={ styles.datePickerItem }
                                                key={item.id}
                                                onPress={() => {updateDate(item.date)}}>
                                                <Text style={
                                                    goalObject.goal.deadline.date == item.date && selectedDate == '-' // for the first time opening
                                                    || selectedDate == item.date ?
                                                    {fontSize:20, color: 'red'} : 
                                                    {color: 'black'}
                                                    }>
                                                {item.date}
                                                </Text>                                      
                                            </TouchableOpacity>   
                                            }
                                        /> 
                                    </View> 

                                    <View style={styles.datePickerColumn}>
                                        <FlatList 
                                            data={monthArray}
                                            numColumns={1}
                                            keyExtractor={(index) => index.toString()} // react throw the error if there is no keys
                                            renderItem={({item}) =>
                                                <TouchableOpacity   
                                                    style={styles.datePickerItem}
                                                    onPress={() => updateMonth(item)}>  
                                                    <Text style={ 
                                                        goalObject.goal.deadline.month == item && selectedMonth == '-' // for the first time opening
                                                        || selectedMonth == item ?
                                                        {fontSize:20, color: 'red'} : 
                                                        {color: 'black'}
                                                    }>
                                                    {item}</Text>               
                                                </TouchableOpacity>   
                                            }
                                        />         
                                    </View> 
                    
                                    <View style={styles.datePickerColumn}>
                                        <FlatList 
                                            data={yearsArray()}
                                            numColumns={1}
                                            renderItem={({item}) =>
                                                <TouchableOpacity   
                                                    style={styles.datePickerItem}
                                                    key={item.id}
                                                    onPress={() => updateYear(item.year)}>      
                                                        <Text style={
                                                            goalObject.goal.deadline.year == item.year && selectedYear == '-' // for the first time opening
                                                            || selectedYear == item.year ? 
                                                            {fontSize:20, color: 'red'} : 
                                                            {color: 'black'}
                                                        }>
                                                    {item.year}</Text>                      
                                                </TouchableOpacity>   
                                            }
                                        />         
                                    </View> 
                            </View>      
                            
                            <TouchableOpacity
                                style = {[styles.okIcon, {marginVertical: '16%', marginRight: 5}]} 
                                onPress={() => { 
                                    showDeadlineModal(false)           
                                    updateGoalInfo()
                                    isDeadlineReached()
                                    }}>
                                <AntDesign name="check" size={40} color="black" />        
                            </TouchableOpacity>        
                        </TouchableOpacity>
                    }
                </TouchableOpacity>
            </Modal>

            <Modal // deadlineReached modal
                transparent = {true} 
                visible = {deadlineReachedModal}>
                <TouchableOpacity
                    onPress={()=>{showDeadlineReachedModal(false)}}
                    style={styles.modal}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={e => {// do not close modal if anything inside modal content is clicked
                            e.stopPropagation()
                        }}
                        style={[styles.modalContent, {height: '25%', flexDirection: 'column'}]}>
                        <View style = {{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Text style = {styles.buttonText}>Goal reached a deadline</Text>       
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                            <TouchableOpacity 
                                onPress={()=> {
                                    navigation.navigate("HomeScreen"),
                                    route.params.moveGoalHandler(goalObject)
                                }}
                                style = {[styles.button, {width: '40%'}]}>
                                <Text>Move goal to completed folder</Text>
                            </TouchableOpacity>
                            <View style = {{width: '40%'}}>
                                <TouchableOpacity 
                                        onPress={() =>{
                                            showDeadlineReachedModal(false) 
                                            showDeadlineModal(true)
                                        }}
                                        style = {[styles.button, {width: '95%', marginBottom: 5}]}>
                                        <Text>Extend deadline</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={()=> {
                                        navigation.navigate("HomeScreen"),
                                        route.params.deleteHandler(goalObject.id)
                                    }}
                                    style = {[styles.button, {width: '95%', marginTop: 5}]}>
                                    <Text>Delete goal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>                   
                       
                    </TouchableOpacity>
                </TouchableOpacity>
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
        width: '40%',
        padding: 10,
        backgroundColor: 'white'
    },
    arrowButton: {
        alignItems: 'center', 
        alignSelf: 'center', 
        borderWidth: 1, 
        borderRadius: 15, 
        borderColor: 'grey', 
        width: '13%',   
    },
    dropdown:{
        //flex:1,
        borderRadius: 20,
        width: 200,
        alignSelf: 'center',
        marginLeft: -50
      },
    // dropdownRow:{
    //     backgroundColor: 'red'
    // },
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
        //width: "40%",
        borderWidth: 2,
        borderBottomWidth: 4,
        borderRightWidth: 4, 
        borderColor: 'rgb(104, 149, 197)',
        //backgroundColor:"yellow",
        borderRadius: 10,
        padding: 10,
        alignSelf: 'center',
        fontSize: 18,
        },
    buttonText: {
        fontSize: 18,
        alignSelf: 'center'
    },
    modal: {
            flex:1,
            backgroundColor: 'rgba(100, 100, 100, 0.6)', // 0.6 represents opacity(from 0 to 1)
            justifyContent:'center'       
        },
    modalContent:{
        height: '10%',
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
    row: {
        paddingHorizontal: 15,
        flexDirection: 'row', 
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    inputField:{ // need to fix
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 13,
        height: '40%', 
        paddingTop: 3,
        paddingLeft: 10, 
        paddingBottom: 5,
        fontSize: 20 ,
        
    },
    icon: { //delete this
        width: 70,                                      
        height: 70,
        borderWidth: 1,
        borderRadius: 50, 
        borderColor: 'silver',
        alignSelf: 'center',
        marginTop:10,  
    },
    okIcon:{
        //alignSelf: 'flex-end', 
        backgroundColor: 'rgb(84, 201, 107)',
        borderWidth: 3,
        borderRadius: 13,
        //marginVertical: 10
    },
    datePickerContainer:{
        //height: '100%',
        width: '80%',
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 10,
        flex:1,
        flexDirection: 'row',
        //width: '80%',
        //alignSelf: 'center',
        //marginBottom: '10%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 15
    },
    // flexBox: {
    //     flex:1,
    //     flexDirection: 'row',
    //     //width: '80%',
    //     alignSelf: 'center',
    //     //marginBottom: '10%',
    //     backgroundColor: 'white',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     borderWidth: 1,
    //     borderColor: "grey",
    //     borderRadius: 20
    // },
    datePickerColumn:{
        paddingVertical: 10,
        width:'33%'
    },  
    datePickerItem:{
        //backgroundColor: 'white',
        //width: '100%',
        alignItems: "center", 
        margin: 5
    }, 
});