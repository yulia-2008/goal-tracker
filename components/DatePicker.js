import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';

export default function DatePicker(props) {

//   useEffect(() => {}, [])

  const monthsArray = [{id:1, month:"January"},{id:2, month:"February"}, {id:3, month:"Martch"},
                 {id:4, month:"April"}, {id: 5, month: "May"}, {id:6, month: "June",},
                 {id:7, month:"July"}, {id:8, month:"August"},{id:9, month:"September"},
                 {id:10, month:"October"}, {id:11, month:"November"},{id:12, month: "December"}
  ]

  const datesArray = () => {
    let array = [];
    for(var i = 1; i <= 31; i++){
        let newDate = {id: i, date: i}
        array.push(newDate);
    }
    return array
  }

  const yearsArray = () => {
    let array = [];
    let year = new Date().getFullYear()
    for(var i = year; i <= year+10; i++){
        let newYear = {id: i, year: i}
        array.push(newYear);
    }
    return array
  }

  const [ selectedDate, setDate] = useState(null)
  const [ selectedMonth, setMonth] = useState(null)
  const [ selectedYear, setYear] = useState(null)
// need this constants for changing style when date/mo/year is selected


  return (
    <View style={styles.container}>
       <View style={styles.dateBox}>
            <FlatList 
                data={datesArray()}
                numColumns={1}
                renderItem={({item}) =>
                    <TouchableOpacity   
                        style={ selectedDate === item.date? 
                                    [styles.item, {backgroundColor: "yellow"}]
                                    : styles.item
                        }
                        key={item.id}
                        onPress={() => {setDate(item.date), props.dateHandler(item.date)}}>
                        <Text>{item.date}</Text>                   
                        {/* delete bar indicator  */}                      
                    </TouchableOpacity>   
                }         
            /> 
        </View> 

        <View style={styles.monthBox}>
            <FlatList 
                data={monthsArray}
                numColumns={1}
                renderItem={({item}) =>
                    <TouchableOpacity   
                        style={ selectedMonth === item.month? 
                            [styles.item, {backgroundColor: "yellow"}]
                            : styles.item
                        }
                        key={item.id}
                        onPress={() => {setMonth(item.month), props.monthHandler(item.month)}}>  
                        <Text>{item.month}</Text>               
                    </TouchableOpacity>   
                }         
            /> 
        </View> 
      
        <View style={styles.yearBox}>
            <FlatList 
                data={yearsArray()}
                numColumns={1}
                renderItem={({item}) =>
                    <TouchableOpacity   
                        style={ selectedYear === item.year? 
                            [styles.item, {backgroundColor: "yellow"}]
                            : styles.item
                        }
                        key={item.id}
                        onPress={() => {setYear(item.year), props.yearHandler(item.year)}}>      
                        <Text>{item.year}</Text>                      
                    </TouchableOpacity>   
                }         
            /> 
        </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    marginBottom: '10%',
    marginTop: '3%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5
  },
  dateBox:{
    padding:0,
    borderWidth: 2,
    borderColor: "grey",
    width:'33.3%'
  },
  yearBox:{
    padding: 0,
    borderWidth: 2,
    borderColor: "grey", 
    width:'33.3%',
  },
  monthBox:{
    padding: 0,
    borderWidth: 2,
    borderColor: "grey", 
    width:'33.3%',
  },
  item:{
    backgroundColor: 'white',
    width: '100%',
    alignItems: "center"
  }
});

