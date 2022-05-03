import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';

export default function Goal({navigation, route}) {

    const goal = route.params.goalObject;
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

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
            // creates nested array [{id:0, data: [janyary, 2022, [1,2,3,4]]}, {id:1, data: [february, 2022, [1,2,3]]},...]
        let array = []
        let count = 0;
        for (let i = 2022; i <= 2040; i ++){      
            monthArray.map(mo => {
                array.push({id: count, data: [mo.name, i, getDates(mo.id, i)]})
                count += 1
            })
        }                
        return array
    }

    const getDates = (month, year) => {
        
        let daysCount = new Date(year, month, 0).getDate();  
                // getDate() return 30 or 31 day, third parameter represents date (1-31),
                // parameter 0 ->  last day of the previos month (will be 30 or 31)
                // Months start with index 0, so the previous month is the needed month          
        let firstDay = new Date(year, month, 1).getDay()  
        let daysArray = [];
        // let daysArrayWithKeys = [] !!!(if need keys for dates)

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
            // for(var i = 0; i <= daysArray.length; i++){
            //     daysArrayWithKeys.push({id: i, date: daysArray[i]});
            // }
            // console.log("dayarr", daysArray)  !!(if keys for dates need)           
      return daysArray
    }
    
    return (
        <View style={styles.container}>  
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
                    data={monthsYearsDatesArray()}
                    renderItem={({item}) =>
                        <View key={item.id}>
                            <Text   // renders "month" - "year" 
                                    style={styles.month}>
                                {item.data[0]} - {item.data[1]}
                            </Text> 
                            <View style = {styles.datesBox}>
                                {item.data[2].map(date => 
                                    <TouchableOpacity   // date cell
                                                        style={styles.date}
                                                        onPress={() => {
                                                            console.log("date pressed")
                                                        }}>
                                        <Text> {date} </Text>
                                    </TouchableOpacity>
                                )}
                            </View>    
                        </View>  
                    }
                /> 
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
    padding: 12,         
    margin: 2,
    marginTop: 8,
    marginBottom: 8,
    flexBasis: '13%',    // flexBasis for child,  flexWrap for parent  => grid!!!
    borderWidth: 2,
    borderColor: "grey",
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

