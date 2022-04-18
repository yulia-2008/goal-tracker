import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';

export default function DatePicker({navigation}) {

//   useEffect(() => {}, [])

  const months = [{id:1, month:"January"},{id:2, month:"February"}, {id:3, month:"Martch"},
                 {id:4, month:"April"}, {id: 5, month: "May"}, {id:6, month: "June",},
                 {id:7, month:"July"}, {id:8, month:"August"},{id:9, month:"September"},
                 {id:10, month:"October"}, {id:11, month:"November"},{id:12, month: "December"}
  ]

  const dates = () => {
    let array = [];
    for(var i = 1; i <= 31; i++){
        let newDate = {id: i, date: i}
        array.push(newDate);
    }
    return array
  }

  const years = () => {
    let array = [];
    let year = new Date().getFullYear()
    for(var i = year; i <= year+10; i++){
        let newYear = {id: i, year: i}
        array.push(newYear);
    }
    return array
  }

  const [deadline, updateDeadline] = useState({date: null, month: null, year: null})
  
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
                    <TouchableOpacity   
                        style={ deadline.date === item.date? 
                                    [styles.item, {backgroundColor: "yellow"}]
                                    : styles.item
                        }
                        key={item.id}
                        onPress={() => setDate(item.date)}>
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
                    <TouchableOpacity   
                        style={ deadline.month === item.month? 
                            [styles.item, {backgroundColor: "yellow"}]
                            : styles.item
                        }
                        key={item.id}
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
                    <TouchableOpacity   
                        style={ deadline.year === item.year? 
                            [styles.item, {backgroundColor: "yellow"}]
                            : styles.item
                        }
                        key={item.id}
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
    padding:15,
    borderWidth: 2,
    borderColor: "grey",
  },
  yearBox:{
    padding: 15,
    borderWidth: 2,
    borderColor: "grey",  
  },
  monthBox:{
    padding: 15,
    borderWidth: 2,
    borderColor: "grey",   
  },
  item:{
    backgroundColor: 'white',
  }
});

