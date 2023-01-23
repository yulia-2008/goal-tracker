// import React, {useState, useEffect} from 'react';
// import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';

// export default function DatePicker(props) {

//   const monthsArray = [{id: 0, month: "-"}, {id:1, month:"January"},{id:2, month:"February"},
//                     {id:3, month:"March"}, {id:4, month:"April"}, {id: 5, month: "May"},
//                     {id:6, month: "June",}, {id:7, month:"July"}, {id:8, month:"August"},
//                     {id:9, month:"September"}, {id:10, month:"October"},
//                     {id:11, month:"November"},{id:12, month: "December"}
//                      ]

//   const datesArray = () => {
//     let array = [{id: 0, date: "-"}];
//     for(let i = 1; i <= 31; i++){
//         let newDate = {id: i, date: i}
//         array.push(newDate);
//     }
//     return array
//   }

//   const yearsArray = () => {
//     let array = [{id: 0, year: "-"}];
//     let year = new Date().getFullYear()
//     for(let i = year; i <= year+10; i++){
//         let newYear = {id: i, year: i}
//         array.push(newYear);
//     }
//     return array
//   }
//   // const [ isDeadline, setIsDealine] = useState(false)
//   const [ selectedDate, setDate] = useState(null)
//   const [ selectedMonth, setMonth] = useState(null)
//   const [ selectedYear, setYear] = useState(null)
// // need this constants for changing style when date/mo/year is selected


//   return (
//     <View style={styles.container}> 
//         <View style={styles.flexBox}>         
//             <View style={styles.dateBox}>
//                 <FlatList 
//                     data={datesArray()}
//                     numColumns={1}
//                     renderItem={({item}) =>
//                         <TouchableOpacity 
//                                 // selected date turn yellow; if close and open datePicker selected date still yellow 
//                             style={ selectedDate === item.date || props.date === item.date ? 
//                                         [styles.item, {backgroundColor: "yellow"}]
//                                         : styles.item
//                             }
//                             key={item.id}
//                             onPress={() => {
//                                 setDate(item.date) 
//                                 // props.dateHandler(item.date)
//                             }}>
//                         <Text>{item.date}</Text>                   
//                             {/* delete bar indicator  */}                      
//                         </TouchableOpacity>   
//                     }/> 
//             </View> 

//             <View style={styles.monthBox}>
//                 <FlatList 
//                     data={monthsArray}
//                     numColumns={1}
//                     renderItem={({item}) =>
//                         <TouchableOpacity   
//                             style={ selectedMonth === item.month || props.month === item.month ? 
//                                 [styles.item, {backgroundColor: "yellow"}]
//                                 : styles.item
//                             }
//                             key={item.id}
//                             onPress={() => {
//                                 setMonth(item.month) 
//                                 // props.monthHandler(item.month)
//                             }}>  
//                             <Text>{item.month}</Text>               
//                         </TouchableOpacity>   
//                     }         
//                 /> 
//             </View> 
            
//             <View style={styles.yearBox}>
//                 <FlatList 
//                     data={yearsArray()}
//                     numColumns={1}
//                     renderItem={({item}) =>
//                         <TouchableOpacity   
//                             style={ selectedYear === item.year || props.year === item.year? 
//                                 [styles.item, {backgroundColor: "yellow"}]
//                                 : styles.item
//                             }
//                             key={item.id}
//                             onPress={() => {
//                                 setYear(item.year) 
//                                 // props.yearHandler(item.year)
//                             }}>      
//                             <Text>{item.year}</Text>                      
//                         </TouchableOpacity>   
//                     }         
//                 /> 
//             </View> 
//         </View>
//         <TouchableOpacity 
//             //style={styles.setButton}
//             onPress={() => props.deadlineHandler({
//               date: selectedDate, 
//               month: selectedMonth, 
//               year: selectedYear
//             })}>
//               <Text style={{fontSize: 18}}>Set Deadline</Text>
//         </TouchableOpacity> 
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     borderWidth: 2,
//     borderColor: "yellow",
//     borderRadius: 5, 
//   } , 
//   flexBox: {
//     flex:1,
//     flexDirection: 'row',
//     width: '100%',
//     alignSelf: 'center',
//     marginBottom: '10%',
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderWidth: 2,
//     borderColor: "grey",
//     borderRadius: 5
//   },
//   dateBox:{
//     padding:0,
//     borderWidth: 2,
//     borderColor: "grey",
//     width:'33.3%'
//   },
//   yearBox:{
//     padding: 0,
//     borderWidth: 2,
//     borderColor: "grey", 
//     width:'33.3%',
//   },
//   monthBox:{
//     padding: 0,
//     borderWidth: 2,
//     borderColor: "grey", 
//     width:'33.3%',
//   },
//   item:{
//     backgroundColor: 'white',
//     width: '100%',
//     alignItems: "center"
//   },
//   text: {
//      alignSelf: 'center' 
//   }
// });

