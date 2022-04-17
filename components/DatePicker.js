import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';

export default function DatePicker() {

//   useEffect(() => {}, [])

  const months = [{key:1, month:"January"},{key:2, month:"February"}, {key:3, month:"Martch"},
                 {key:4, month:"April"}, {key: 5, month: "May"}, {key:6, month: "June",},
                 {key:7, month:"July"}, {key:8, month:"August"},{key:9, month:"September"},
                 {key:10, month:"October"}, {key:11, month:"November"},{key:12, month: "December"}
  ]

  const dates = () => {
    let array = [];
    for(var i = 1; i <= 31; i++){
        let newDate = {key: i, date: i}
        array.push(newDate);
    }
    return array
  }

  const years = () => {
    let array = [];
    let year = new Date().getFullYear()
    for(var i = year; i <= year+10; i++){
        let newYear = {key: i, year: i}
        array.push(newYear);
    }
    return array
  }

  const [deadline, updateDeadline] = useState({date: "not celected", month: "not celected", year: "not celected"})
  
const setDate = (item) => {
    let newDeadline = {...deadline, date: item}
    updateDeadline(newDeadline)
}
const setMonth = (item) => {
    let newDeadline = {...deadline, month: item}
    updateDeadline(newDeadline)
}
const setYear = (item) => {
    let newDeadline = {...deadline, year: item}
    updateDeadline(newDeadline)
}

  return (
    <View style={styles.container}>
       <View style={styles.dateBox}>
            <FlatList 
                data={dates()}
                numColumns={1}
                renderItem={({item}) =>
                    <TouchableOpacity   style={styles.item}
                                        key={item.key}
                                        onPress={() => {setDate(item.date)}}>
                        <Text>{item.date}</Text>                   
                        {/* delete bar indicator  */}                      
                    </TouchableOpacity>   
                }         
            /> 
        </View> 

        <View style={styles.monthBox}>
            <FlatList 
                data={months}
                numColumns={1}
                renderItem={({item}) =>
                    <TouchableOpacity   style={styles.item}
                                        key={item.key}
                                        onPress={() => {setMonth(item.month)}}>  
                        <Text>{item.month}</Text>               
                    </TouchableOpacity>   
                }         
            /> 
        </View> 
      
        <View style={styles.yearBox}>
            <FlatList 
                data={years()}
                numColumns={1}
                renderItem={({item}) =>
                    <TouchableOpacity   style={styles.item}
                                        key={item.year}
                                        onPress={() => {setYear(item.year)}}>      
                        <Text>{item.year}</Text>                      
                    </TouchableOpacity>   
                }         
            /> 
            <Text>{console.log("k", deadline)}</Text>
        </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    width: "80%",
    alignSelf: 'center',
    marginBottom: '6%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5
  },
  dateBox:{
    padding:15
  },
  yearBox:{
    padding: 15,  
  },
  monthBox:{
    padding: 15,   
  },
  item:{
    backgroundColor: 'white',
  }
});

