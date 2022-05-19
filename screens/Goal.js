import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedbackBase } from 'react-native';

export default function Goal({navigation, route}) {

    const goal = route.params.goalObject;
    
    const [currentMonth, setCurrentMonth] = useState(null)
    const [dateClicked, setValue] = useState(false)
    // const [itemsHeight, setItemsHeight] = useState({})
    // const [button, setValue] = useState(false)
    const [ref, setRef] = useState(0);
    // useEffect(() =>  scrollToCurrentMont(
    //     // animated: true,
    //     // index: currentMonth,
    //     // viewPosition: 0
    // ), [ref])

    useEffect(() =>  getMonth(), [])
   

    // const scrollToCurrentMont = () => {
    //     ref.scrollToIndex({animated: true,
    //          index: currentMonth,
    //          viewPosition: 0})
    //     //  DOES NOT WORK !!
    // }


    const monthArray = [{id: 0, name:'January'}, {id: 1, name: 'February'},
                        {id: 2, name: 'March'}, {id: 3, name:'April'},
                        {id: 4, name: 'May'}, {id: 5, name:'June'},
                        {id: 6, name: 'July'}, {id: 7, name: 'August'},
                        {id: 8, name: 'September'}, {id: 9, name: 'October'},
                        {id: 10, name: 'November'}, {id: 11, name:'December'}]

    const weekDays = () => {
        let days = new Array("Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"); 
        let daysWithKeys = []
        for (let i = 0; i < days.length; i++){
            daysWithKeys.push({id: i, day: days[i]})
        }
        return daysWithKeys
    }

    const monthsYearsDatesArray = () => {
            // creates nested array [ {id:0, month: [janyary, 2022], dates: [{id: 0, date: 1}, {id: 1, date: 2}, ...] },...]
        let dataArray = []
        let count = 0;
        for (let i = 2022; i <= 2040; i ++){      
            monthArray.map(mo => {
                dataArray.push({id: count, month: [mo.name, i], dates: getDates(mo.id, i)})
                count += 1
            })
        }              
        return dataArray
    }

    const getDates = (month, year) => {
        
        let daysCount = new Date(year, month, 0).getDate();  
                // getDate() return 30 or 31 day, third parameter represents date (1-31),
                // parameter 0 ->  last day of the previos month (will be 30 or 31)
                // Months start with index 0, so the previous month is the needed month          
        let firstDay = new Date(year, month, 1).getDay()  
        let daysArray = [];
        let daysArrayWithKeys = []  

        for (let i = 1; i <= daysCount; i++) {
            daysArray.push(i);
        }
        switch (firstDay) {
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

                // If the 1st day of the month starts not on Monday 
                // push "" to the begining of the daysArray 
            }
            for(var i = 0; i <= daysArray.length-1; i++){
                daysArrayWithKeys.push({id: i, date: daysArray[i]});
            }          
      return daysArrayWithKeys
    }

    // const currentMontIndex = () => {
    //     /// slowing down initial calendar rendering
    //        // finds in monthsYearsDatesArray an object that holds current month
    //        //  and returns index of that object
    //     const currentDate = new Date()
    //     const currentYear = currentDate.getFullYear()
    //     const currentMonth = currentDate.getMonth() 
    //     let currentMo = monthsYearsDatesArray().find( 
    //             obj => obj.month[0] === monthArray[currentMonth].name
    //             && obj.month[1] === currentYear    
    //     )     
    //     return currentMo.id
    // }

    const getMonth = () => {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() 
        let currentMo = monthsYearsDatesArray().find( 
                obj => obj.month[0] === monthArray[currentMonth].name
                && obj.month[1] === currentYear    
        )  
        // console.log("test",currentMo.id) 
        setCurrentMonth(currentMo.id)       
    }

    
    
    return (
        <View style={styles.container}>  
        {/* {console.log("cu", currentMonth)}
        {console.log("cu2", monthsYearsDatesArray()[4].month)} */}
            <Text>{goal.text}  </Text> 
            <Text> Deadline: {goal.month} / {goal.date} / {goal.year} </Text>
            <Text> Pereodicity: {goal.timeRange} </Text>

            <View style={styles.calendarBox}>
                <View style={styles.calendarHeader}>
                    { weekDays().map(item => {
                        return  <TouchableOpacity style={styles.weekDayBox} key={item.id}>
                                    <Text>{item.day}</Text>
                                </TouchableOpacity> 
                      })
                    }     
                </View>       
                <FlatList 
                    // creates Calendar List !! 
                    // FlatList can not be inside of ScrollView, 
                    // so I did not use FlatList to render dates
                    //keyExtractor={item => item.id}
                    data = {monthsYearsDatesArray()}
                    // initialScrollIndex = {currentMontIndex()}
                    // initialScrollIndex = {current}
                    ref={ref => setRef(ref)}
                    // onScroll={()=>console.log("scroll", data.length)}
                    // does not scroll back for the first time
                    // initialScrollIndex disables the "scroll to top" optimization
                    //  that keeps the first initialNumToRender (10 by default) items always rendered
                    //  and immediately renders the items starting at this initial index
                    renderItem = {({item}) => 
                        <View   key = {item.id}
                        // onLayout={(event) => {
                            //  use itemHeight to calculate offset (in getItemLayout)       
                            // let itemHeight = event.nativeEvent.layout.height
                            // setItemsHeight((prevState => ({ ...prevState, [item.id]: itemHeight })));
                            //console.log('state:', itemsHeight);
                          // }}   
                        >
                            <Text   // renders "month" - "year"
                                    style={styles.month}>
                                {item.month[0]} - {item.month[1]} 
                            </Text> 
                            <View style = {styles.datesBox}>
                                 {item.dates.map(dateObj => 
                                    <TouchableOpacity   // render date cell
                                                        key = {dateObj.id}
                                                        style={styles.date}
                                                        onPress={() => {
                                                            setValue(!dateClicked)
                                                        }}>
                                        <Text style = {styles.text}> {dateObj.date} </Text>
                                    </TouchableOpacity>
                                )} 
                            </View>  
                            <Modal 
                                transparent = {true} 
                                visible = {dateClicked}>
                                <View style={styles.modal}>
                                    <View style={styles.modalContent}>
                                        <Text>Mark as accomplished?</Text>
                                        <TouchableOpacity>
                                            <Text>YES</Text></TouchableOpacity>
                                        <TouchableOpacity>
                                            <Text>CANCEL</Text></TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>  
                        </View>  
                    }
                    // getItemLayout={(data, index) => ({
                    //     // need to use layout(itemHeight) and calculate offset
                    //     length: 367,                              
                    //     offset: 367, // The distance (in pixels) of the current row from the top of the FlatList. 
                    //     index, //The current row index.
                    //   })}  

                />
                  
            </View>        
            <TouchableOpacity   style={styles.button}
                                onPress={() => ref.scrollToIndex({
                                    animated: true,
                                    index: currentMonth,
                                    viewPosition: 0
                                })}>
                <Text style={styles.textSize}>Current month</Text>
            </TouchableOpacity>
                                      
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
    textSize: {
        fontSize: 18
    },
    modal: {
        flex:1,
        backgroundColor: 'rgba(100, 100, 100, 0.1)', // 0.1 represents opacity
        justifyContent:'center'       
    },
    modalContent:{
        
        backgroundColor: 'white',
        alignSelf: 'center',
        margin: 50,
        padding: 40,

    }
    
});