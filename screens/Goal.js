import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';

export default function Goal({navigation, route}) {

    const goal = route.params.goalObject;

    const weekDays = () => {
        let days = new Array("Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"); 
        let daysWithKeys = []
        for (let i = 0; i < days.length; i++){
            daysWithKeys.push({id: i, day: days[i]})
        }
        return daysWithKeys
    }

    const years = () => {
        let array = [];
        for(var i = 2020; i <= 2050; i++){
            array.push({id: i, year: i});
        }
        return array
    }

    const months = () => {
        let array = new Array('January', 'February', 'March', 'April',
                                    'May', 'June', 'July', 'August', 'September',
                                     'October', 'November', 'December'); 
        let monthWithKeys = []
        for (let i = 0; i < array.length; i++){
            monthWithKeys.push({id: i+1, month: array[i]})
        }
        return monthWithKeys
    }

    const dates = (year, month) => { 
        let count = new Date(year, month, 0).getDate();
        let array = [];
        for(var i = 1; i <= count; i++){
            array.push({id: i, date: i});
        }
        return array
    }

    return (
        <View style={styles.container}>  
            <Text>{goal.text}  </Text> 
            <Text> Deadline: {goal.month} / {goal.date} / {goal.year} </Text>
            <Text> Pereodicity: {goal.timeRange} </Text>
            <View style={styles.calendarBox}>
                <View style={styles.calendarHeader}>
                    { weekDays().map(item => {
                        return  <TouchableOpacity style={styles.dayBox} key={item.id}>
                                    <Text>{item.day}</Text>
                                </TouchableOpacity> 
                      })
                    }
                </View>              
                <ScrollView style={styles.yearBox}>
                { years().map(yearObject => {
                    return  <View style={styles.yearBox} key={yearObject.id}>
                                <Text>{yearObject.year}</Text>
                                    {months().map(monthObject => {
                                        return  <ScrollView style={styles.monthsBox} key= {monthObject.id}>
                                                    <Text>{monthObject.month}</Text>
                                                    <FlatList 
                                                        data={dates(yearObject.year, monthObject.id)}
                                                        numColumns={7}
                                                        renderItem={({item}) =>
                                                            <TouchableOpacity  
                                                                style={ styles.dates}
                                                                key={item.id}
                                                                onPress={() => {
                                                                    console.log("date pressed")
                                                                }}>
                                                            <Text>{item.date}</Text>                                        
                                                            </TouchableOpacity>   
                                                        }/> 


                                                    {/* {dates(yearObject.year, monthObject.id).map(dateObject => {
                                                        return  <View style={styles.dates} key={dateObject.id}>
                                                                    <Text>{dateObject.date}</Text>
                                                                    
                                                                </View>
                                                    })
                                                    }      */}
                                                </ScrollView>
                                    })
                                    }
                            </View> 
                })
                }
            
                </ScrollView>
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
    alignItems: 'flex-start' 
  },
  calendarBox: {
    flex:1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5
  },
  calendarHeader:{
    flex: 0.1,
    justifyContent: 'space-around',
    width: '100%',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: "red",
    alignItems: 'stretch'
  },
  dayBox:{
    borderWidth: 2,
    borderColor: "blue",
  },
  yearBox: {
    flex: 2,
    width: '100%',
    borderWidth: 2,
    borderColor: "yellow",
  },
  monthsBox: {
    flex: 1,
    width: '100%',
    borderWidth: 2,
    borderColor: "black",
  },
  dates: {
    borderWidth: 2,
    borderColor: "pink",
  }
});

