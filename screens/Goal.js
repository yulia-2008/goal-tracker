import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Image, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedbackBase, ScrollView } from 'react-native';
//import SelectDropdown from 'react-native-select-dropdown';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 


export default function Goal({navigation, route}) {
    const goalObject = route.params.goalObject;
    const goalCompleted = goalObject.goal.text.includes('COMPLETED')
    
    const [calendarData, updateCalendarData] = useState(goalObject.calendar)
    const [currentMonth, setCurrentMonth] = useState(null)
    const [currentDate, setCurrentDate] = useState(null)
    const [currentCell, updateCurrentCell] = useState(null)

    const [cellModal, showCellModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [datePickerModal, showDatePickerModal] = useState(false)
    const [deadlineReachedModal, showDeadlineReachedModal] = useState(false)
    const [timeRangeModal, showTimeRangeModal] = useState(false)
    
    const [selectedDateDeadline, updateDateDeadline] = useState(goalObject.goal.deadline.date)
    const [selectedMonthDeadline, updateMonthDeadline] = useState(goalObject.goal.deadline.month)
    const [selectedYearDeadline, updateYearDeadline] = useState(goalObject.goal.deadline.year)
    const [selectedDateStart, updateDateStart] = useState(goalObject.goal.startDate.date)
    const [selectedMonthStart, updateMonthStart] = useState(goalObject.goal.startDate.month)
    const [selectedYearStart, updateYearStart] = useState(goalObject.goal.startDate.year)

    const [buttonClicked, updateValue] = useState(false)
    const [switchValue, updateSwitch] = useState(false)
    const [note, updateNote] = useState('')
    const [stats, updateStats] = useState({})
   
    useEffect(() => {getCurrentMonthDate()},[]) 
    //useEffect(() => {console.log('curDay - in effect', currentDate)},[currentDate, currentMonth]) 
        
    const monthArray = ["--", "Jan","Feb","Mar","Apr","May","June","July",
                      "Aug","Sep","Oct","Nov","Dec"]
    const weekDays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
    const rangeData = ['- -' , "One time", "Every day /1", "Every other day /2", "3 times a week /2.33",
                   "2 times a week /3.5", "Every week /7", "Every 2 weeks /14", "Every month /30"]

    const date = new Date()
    const currYear = date.getFullYear()
    const currMonth = date.getMonth() // output 0 to 11 
    const currDate = date.getDate() 

    const getCurrentMonthDate = () => {
        // finds currentMonth.id, currentDate objects in calendarData array, 
        // check if deadline reached
        let currentMonthObject = calendarData.find(obj =>
                obj.month === monthArray[currMonth+1]
                && obj.year === currYear    
        ) 
        let currentDateObject = currentMonthObject.dates.find(obj => 
            obj.date == currDate
        )       
        setCurrentMonth(currentMonthObject.id) 
        setCurrentDate(currentDateObject)

        !goalCompleted && goalObject.goal.deadline.dateId && 
        goalObject.goal.deadline.dateId <= currentDateObject.id ? 
             showDeadlineReachedModal(true) : null
            // can not just call isDeadlineReached() because currentDate is undefined that way           
    }
    
    const isDeadlineReached = () => {
        // called by datePicker / !!! need to add calling it on currentDay change
        // fix: code repetition in getCurrentMonthDate     
        !goalCompleted && goalObject.goal.deadline.dateId && 
        goalObject.goal.deadline.dateId <= currentDate.id ? 
            showDeadlineReachedModal(true) : null
    }

    const datesArray = () => {
        // generates dates for goal deadline container
        // need to fix: allowed to chose 31 for all months
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
        for(let i = year; i <= 2027; i++){
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

    const definePadding = (note) => { 
        // need to insert '*' if the date has a note => need more space: less padding  
        let padding;
        note.trim() != "" ? padding = 2 : padding = 10
        return padding  
    }

    const defineTextStyle = (selectedItem, goalObjectItem , item) => { 
        // selectedItem --> from state
        // goalObjectItem --> goalObject.goal.deadline/startDate.date/month/year
        // item --> date/month/year (variable, comes from datePicker renderItem)
        let style;
        
        goalObjectItem == item && selectedItem == '-' // for the first time opening
        || selectedItem == item ?
         style = {fontSize:20, color: 'red'} : 
         style = {color: 'black'}

        return style
    }
    const datePickerHandler = () => {
        // check if all (day, month, year) are selected
        (buttonClicked =='start date' &&
        selectedDateStart != "--" &&
        selectedMonthStart != "--" &&
        selectedYearStart !== "--")
        ||
        (buttonClicked == 'deadline' &&
        selectedDateDeadline != "--" && 
        selectedMonthDeadline != "--" &&
        selectedYearDeadline != "--") ?                                  
        (showDatePickerModal(false), updateGoalInfo(), isDeadlineReached(), getStatistic())
        :
        console.log('DATEPICKER: did not selecte all')
        
    }

    const editDate = () =>{     
        // updateting calendarData and go to HomeScreen for updating Async Storage 
        let newCalendarData = [...calendarData] 
        newCalendarData[currentMonth].dates.find(obj => obj.id == currentCell.id).done = switchValue
        newCalendarData[currentMonth].dates.find(obj => obj.id == currentCell.id).note = note
        updateCalendarData(newCalendarData)
        route.params.editCellHandler(newCalendarData, goalObject.id) 
    }
    
    const updateGoalInfo = (param) => {  //! bug: works only if all 3 selected(day, month and year)
         // updating timeRange and deadline
        let newGoalObject = Object.assign({}, goalObject)
        
        if(param){
            // param comes from updating timeRange
            // undefined param  --> false value --> comes from datePickerModal  
           newGoalObject.goal.timeRange = param
        }
        else if(buttonClicked == 'deadline'){ 
            let foundMonthObject = calendarData.find(obj=> 
                obj.year == selectedYearDeadline && obj.month == selectedMonthDeadline
                )  
            let foundDateObject  = foundMonthObject.dates.find(obj => 
                obj.date == selectedDateDeadline
                ) 
            newGoalObject.goal.deadline = {
                date: selectedDateDeadline, 
                month: selectedMonthDeadline, 
                year: selectedYearDeadline,
                dateId: foundDateObject.id
            }
            updateValue(false)  // updating buttonClicked 
        }
        else if(buttonClicked == 'start date'){
            let foundMonthObject = calendarData.find(obj=> 
                obj.year == selectedYearStart && obj.month == selectedMonthStart
                )  
            let foundDateObject  = foundMonthObject.dates.find(obj => 
                obj.date == selectedDateStart
                ) 
            newGoalObject.goal.startDate = {
                date: selectedDateStart, 
                month: selectedMonthStart, 
                year: selectedYearStart,
                dateId: foundDateObject.id
            }
            updateValue(false)   
        }
        route.params.editGoalHandler(newGoalObject)
    }

    const getStatistic = () => {
            // if date is marked 'done' before the start date or after deadline
            // it is not gonna be count
            // function call by cellModal (when date marked as done); timeRange Modal; datePickerHandler
            // need to add calling it on currentDay changed and on initial rendering!!!!
                
        let perCent = '  Can not calculate %. The start date is not selected!';
        let startDateId = goalObject.goal.startDate.dateId
        let deadlineId = goalObject.goal.deadline.dateId
        let timeRange = goalObject.goal.timeRange
        let pereodicity;  // if timeRange did not chose, counting as due every day.
        timeRange == '- -' ? pereodicity = 1 : pereodicity = Number(goalObject.goal.timeRange.split('/')[1])

        let allDaysCount = 0
        let requiredDaysToComplete = 0
        let completedDaysCount = 0
        if(startDateId && deadlineId){
            let lastDayCount;  //  it does not count days after deadline (if deadline before current day --> completed) 
            deadlineId > currentDate.id ? lastDayCount = currentDate.id : lastDayCount = deadlineId

            calendarData.map (obj => obj.dates.filter(dateObj =>  
                {   if(dateObj.id >= startDateId &&
                        dateObj.id <= lastDayCount &&
                        typeof dateObj.date == 'number'){// some dates are string (days of next and prev month on calendar)
                    allDaysCount += 1  
                    dateObj.done == true ?  completedDaysCount += 1 : null
                    }            
                }
            ))
        }  
        else if(startDateId){
            calendarData.map (obj => obj.dates.filter(dateObj =>  
                {   if(dateObj.id >= startDateId &&
                        dateObj.id <= currentDate.id &&
                        typeof dateObj.date == 'number'){// some dates are string (days of next and prev month on calendar)
                    allDaysCount += 1  
                    dateObj.done == true ?  completedDaysCount += 1 : null
                    }            
                }
            ))          
        } 
        requiredDaysToComplete = Math.floor(allDaysCount / pereodicity)
        requiredDaysToComplete !=0 ?
        perCent = Math.round(completedDaysCount * 100 / requiredDaysToComplete) : perCent = ""
        updateStats({allDays: allDaysCount, completed: completedDaysCount, perCent: perCent})
       }

    return (
        <View style={styles.container}>  
         {/* {console.log('%')}  */}
                {calendarData && currentMonth != null ?  // if currentMonth == 0 is false --> loading
                    <>                    
                    <View style = {styles.calendarContainer}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style = {[styles.arrowButton,{backgroundColor: goalObject.color}]}
                                onPress = {()=> setCurrentMonth(currentMonth-1)}>
                                <Feather name="chevrons-left" size={45} color="black" />
                            </TouchableOpacity>
                            <Text style = {[styles.month, 
                                            {backgroundColor: goalObject.color}
                                        ]}>
                                {calendarData[currentMonth].month} - {calendarData[currentMonth].year}
                            </Text>  
                            <TouchableOpacity 
                                style = {[styles.arrowButton,{backgroundColor: goalObject.color}]}
                                onPress = {()=> setCurrentMonth(currentMonth+1)}>
                                <Feather name="chevrons-right" size={45} color="black" />
                            </TouchableOpacity> 
                        </View>
                                
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
                                                           paddingHorizontal: definePadding(dateObj.note)},
                                            dateObj.id == currentDate.id ? {borderWidth: 1, borderColor: 'red'}: null
                                                         
                                    ]}
                                    onPress={() => {
                                        showCellModal(true)
                                        updateCurrentCell(dateObj) 
                                        updateSwitch(dateObj.done)
                                        updateNote(dateObj.note)
                                    }}>
                                    
                                    {dateObj.note.trim() != "" ?
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{fontSize: 25}}>{dateObj.date}</Text>
                                            <Text style= {{color: 'rgb(100,100,100)', fontSize: 10}}>{' \u2731'}</Text>
                                        </View>:
                                        <Text style={{fontSize: 25}}>{dateObj.date}</Text>    // '\u2731' - unicode for ✱ ; ' \u2B24' - unicode for 'dot'
                                    }                                                                              
                                                                
                                </TouchableOpacity>
                                : 
                                <View   // render prev and next month dates
                                    key = {dateObj.id} 
                                    style={styles.date}>
                                    <Text style = {{fontSize: 25, color: 'rgb(205, 205, 205)'}}>
                                        {dateObj.date}
                                    </Text> 
                                </View>
                            })}
                        </View> 
                    </View>

                    <View style = {styles.buttonContainer}>
                        <TouchableOpacity 
                            style = {[styles.buttons,{paddingVertical: 3}]}
                            onPress = {() => {
                                updateValue('start date')
                                showDatePickerModal(true)
                            }}>
                            <Text style = {styles.buttonText}>Start Date</Text>
                            <Text style={styles.buttonText}>{goalObject.goal.startDate.month} {goalObject.goal.startDate.date} {goalObject.goal.startDate.year} </Text>             
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style = {[styles.buttons,{paddingVertical: 3}]}
                            onPress = {() => {
                                updateValue('deadline')
                                showDatePickerModal(true)
                            }}>
                            <Text style = {styles.buttonText}>Deadline</Text>
                            <Text style={styles.buttonText}>{goalObject.goal.deadline.month} {goalObject.goal.deadline.date} {goalObject.goal.deadline.year} </Text>             
                        </TouchableOpacity>             
                    </View>

                    <View style={styles.buttonContainer}>                       
                        <TouchableOpacity 
                            onPress={()=> showTimeRangeModal(true)} 
                            style = {[styles.buttons, {paddingVertical: 3}]}>
                            <Text style = {styles.buttonText}>Pereodicity</Text>  
                            <Text style={styles.buttonText}>{goalObject.goal.timeRange.split('/')[0]} </Text> 
                        </TouchableOpacity>                                                                      
                        <TouchableOpacity 
                            style = {styles.buttons}
                            onPress={()=>showDeleteModal(!deleteModal)}> 
                            <Text style={styles.buttonText}> 
                                Delete Goal 
                            </Text>
                        </TouchableOpacity> 
                    </View>                          
                    {/* <Text style={styles.buttonText}>Statistic</Text>  */}
                    <Text>Days since the Start Day: {stats.allDays}</Text>
                    <Text>Completed days: {stats.completed}</Text>
                    <Text>Completion, %: {stats.perCent}</Text> 
                    </>
                    :
                    <Text>Loading</Text>                                       
                }  
 
                <Modal // timeRangeModal
                    transparent = {true} 
                    visible = {timeRangeModal}>
                    <TouchableOpacity 
                        onPress={()=>showTimeRangeModal(false)}
                        style={styles.modal}>
                        {goalCompleted?
                            <Text style={[styles.modalContent, {height: '10%', fontSize: 18, textAlign: 'center'}]}>
                                Can not change it. Goal is completed
                            </Text>
                            :
                            <TouchableOpacity 
                                style={[styles.modalContent, {flexDirection: 'column', paddingHorizontal: '4%', width: '50%'}]}> 
                                {rangeData.map((elem, ind) =>{ 
                                    return  <TouchableOpacity
                                                key={ind} 
                                                onPress={() => {
                                                    showTimeRangeModal(false)
                                                    updateGoalInfo(elem)
                                                    getStatistic()                                             
                                                }}
                                                style={{padding: 10}}>
                                                <Text style={styles.buttonText}>{elem.split('/')[0]}</Text>
                                            </TouchableOpacity>
                                })}                   
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                </Modal>

                <Modal // cellModal
                    transparent = {true} 
                    visible = {cellModal}>
                    <TouchableOpacity 
                        onPress={()=>showCellModal(false)}
                        style={styles.modal}>
                        {goalCompleted?
                            <Text style={[styles.modalContent, {height: '10%', fontSize: 18, textAlign: 'center'}]}>
                                Can not change it. Goal is completed </Text>
                            :
                            <TouchableOpacity 
                                activeOpacity={1} // disable highlighting effect
                                onPress={e => {// do not close modal if anything inside modal content is clicked
                                    e.stopPropagation()
                                }}
                                style={[styles.modalContent, {flexDirection: 'column', height: '30%', paddingHorizontal: '4%'}]}>
                                
                                <View style = {styles.row}>
                                    <Text style = {styles.buttonText} >Not Done</Text>
                                    <Switch 
                                        onValueChange={value=> {updateSwitch(value)}}
                                        style = {{transform: [{ scaleX: 2 }, { scaleY: 2 }]}}
                                        //value = {currentCell? currentCell.done : false}
                                        value = {switchValue}
                                        trackColor={{false: 'rgb(224, 224, 224)', true: 'yellow'}}
                                        thumbColor='grey'                                  
                                    />
                                    <Text style= {styles.buttonText}>Done</Text>                              
                                </View>

                                <TextInput  
                                    style={styles.inputField}
                                    autoFocus={true} 
                                    placeholder='enter note'
                                    onChangeText = {enteredText => {updateNote(enteredText)}}                   
                                    multiline={true}  
                                    //value = {currentCell? currentCell.note : null}
                                    value = {note}
                                /> 

                                <TouchableOpacity  
                                    style = {[styles.okIcon, {marginHorizontal: '43%'}]} 
                                    onPress={() => {
                                    editDate()
                                    showCellModal(false)
                                    getStatistic()
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
            
            <Modal // datePickerModal
                transparent = {true} 
                visible = {datePickerModal}>
                <TouchableOpacity 
                    onPress={()=>{showDatePickerModal(false), updateValue(false)}}
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
                                            data={datesArray()}   // array of object --> keys: id, date
                                            numColumns={1}
                                            renderItem={({item}) =>
                                            <TouchableOpacity 
                                                style={ styles.datePickerItem }
                                                key={item.id}
                                                onPress={() => buttonClicked === 'deadline' ?
                                                    updateDateDeadline(item.date): updateDateStart(item.date)
                                                }>
                                                <Text 
                                                 style={ buttonClicked === 'deadline' ?
                                                    defineTextStyle(selectedDateDeadline, goalObject.goal.deadline.date, item.date):
                                                    defineTextStyle(selectedDateStart, goalObject.goal.startDate.date, item.date )
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
                                                    onPress={() => buttonClicked === 'deadline' ?
                                                        updateMonthDeadline(item): updateMonthStart(item)
                                                    }>  
                                                    <Text style = {buttonClicked === 'deadline' ?
                                                        defineTextStyle(selectedMonthDeadline,goalObject.goal.deadline.month , item):
                                                        defineTextStyle(selectedMonthStart, goalObject.goal.startDate.month, item)
                                                    }>                                          
                                                    {item}</Text>               
                                                </TouchableOpacity>   
                                            }
                                        />         
                                    </View> 
                    
                                    <View style={styles.datePickerColumn}>
                                        <FlatList 
                                            data={yearsArray()}   //array of objects, keys are : id, year
                                            numColumns={1}
                                            renderItem={({item}) =>
                                                <TouchableOpacity   
                                                    style={styles.datePickerItem}
                                                    key={item.id}
                                                    onPress={() => buttonClicked === 'deadline' ?
                                                        updateYearDeadline(item.year): updateYearStart(item.year)
                                                    }>      
                                                        <Text style = {buttonClicked === 'deadline' ?
                                                            defineTextStyle(selectedYearDeadline, goalObject.goal.deadline.year, item.year):
                                                            defineTextStyle(selectedYearStart, goalObject.goal.startDate.year, item.year )
                                                        }>
                                                    {item.year}</Text>                      
                                                </TouchableOpacity>   
                                            }
                                        />         
                                    </View> 
                            </View>      
                            
                            <TouchableOpacity
                                style = {[styles.okIcon, {marginVertical: '16%', marginRight: 5}]} 
                                onPress={() => datePickerHandler()}>
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
                        style={[styles.modalContent, { flexDirection: 'column'}]}>
                        <View style = {{ justifyContent: 'space-around', padding: 10}}>
                            <Text style = {styles.buttonText}>Goal reached it's deadline.</Text>  
                            <Text style = {styles.buttonText}>Action needed.</Text>     
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-around', paddingTop: 10}}>
                            <TouchableOpacity 
                                onPress={()=> {
                                    navigation.navigate("HomeScreen"),
                                    route.params.moveGoalHandler(goalObject)
                                }}
                                style = {[styles.buttons, {width: '40%', backgroundColor: goalObject.color, borderColor: 'rgb(80, 80, 80)'}]}>
                                <Text style = {styles.buttonText}>Move goal </Text>
                                <Text style = {styles.buttonText}>to archive</Text>
                            </TouchableOpacity>
                            <View style = {{width: '40%'}}>
                                <TouchableOpacity 
                                        onPress={() =>{
                                            showDeadlineReachedModal(false) 
                                            updateValue('deadline')  // buttonClicked
                                            showDatePickerModal(true)
                                        }}
                                        style = {[styles.buttons, {width: '95%', marginBottom: 5, backgroundColor: goalObject.color, borderColor: 'rgb(80, 80, 80)'}]}>
                                        <Text style = {styles.buttonText}>Extend deadline</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={()=> {
                                        navigation.navigate("HomeScreen"),
                                        route.params.deleteHandler(goalObject.id)
                                    }}
                                    style = {[styles.buttons, {width: '95%', marginTop: 5, backgroundColor: goalObject.color, borderColor: 'rgb(80, 80, 80)'}]}>
                                    <Text style = {styles.buttonText}>Delete goal</Text>
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
        paddingHorizontal: '2%',
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    goalInfoText:{
        fontSize: 18,
    },
    calendarContainer: { // include header and dates 
        // borderWidth: 1,
        // borderColor: "grey",
        // borderRadius: 25,
        flex: 1,
        paddingVertical: 9,
        // marginBottom: 10
        //backgroundColor: 'rgb(224, 224, 224)',       
    },
    calendarHeader:{ //weekdays
        justifyContent: 'space-between', // horizontally
        width: '100%',
        flexDirection: 'row',
        //paddingHorizontal: 10,
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
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center', // vertically

    },
    month: {
        width: '70%',
        padding: '3%',
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        borderWidth: 1,
        borderRadius: 13,
        borderColor: "grey",
    },
    buttonContainer:{
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
        // height: 50
    },
    buttons:{
        borderWidth: 1, 
        // borderBottomWidth: 4,
        // borderRightWidth: 4, 
        borderRadius: 15, 
        borderColor: 'rgb(160,160,160)', 
        width: '48%',
        padding: 10,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        alignSelf: 'center'
    },
    arrowButton: {
        alignItems: 'center', 
        alignSelf: 'center', 
        borderWidth: 1, 
        // borderBottomWidth: 4,
        // borderRightWidth: 4, 
        borderRadius: 15, 
        borderColor: 'rgb(160,160,160)', 
        width: '13%',   
    },
    dropdown:{
        //flex:1,
        borderRadius: 20,
        width: 200,
        alignSelf: 'center',
        //marginLeft: -50
      },
    // dropdownRow:{
    //     backgroundColor: 'red'
    // },
    datesBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        //justifyContent: 'space-between'
        //paddingHorizontal: 10,
        //borderWidth: 1,
        // borderColor: 'red'
    }, 
    date: {
        alignItems: 'center',   // gorizontally
        //padding: 10, 
        paddingVertical: 10,        
        margin: 2,
        marginVertical: '3%',
        flexBasis: '13.2%',    // flexBasis for child,  flexWrap for parent  => grid!!!
        //borderWidth: 1, 
        // borderBottomWidth: 4,
        // borderRightWidth: 4, 
        borderColor: 'rgb(160, 160, 160)',
        borderRadius: 13
    },
    emptyDate:{
        alignItems: 'center',   // gorizontally
        padding: 13,         // it is not 10 because there is no border
        margin: 2,
        marginTop: 8,
        marginBottom: 8,
        flexBasis: '13%'
    },
    // textCell: { // does it affect?
    //     textAlign: 'center',
    //     textAlignVertical: 'center'
    // },
    modal: {
            flex:1,
            backgroundColor: 'rgba(100, 100, 100, 0.8)', // 0.6 represents opacity(from 0 to 1)
            justifyContent:'center'       
        },
    modalContent:{
        //height: '10%',
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