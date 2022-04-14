import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';

export default function DatePicker() {

//   useEffect(() => {}, [])

  const months = ["January", "February", "Martch", "April", "May", 
  "June", "July", "August", "September", "October", "November", "December"
  ]

  const dates = () => {
    let array = [];
    for(var i = 1; i <= 31; i++){
        array.push(i);
    }
    return array
  }

  const years = () => {
    let array = [];
    let year = new Date().getFullYear()
    for(var i = year; i <= year+10; i++){
        array.push(i);
    }
    return array
  }
  
  return (
    <View style={styles.container}>
       <View style={styles.dateBox}>
          <FlatList 
              data={dates()}
              numColumns={1}
              renderItem={({item}) =>
                  <TouchableOpacity style={styles.item}
                                    key={dates().indexOf(item)}
                                    // onPress={() => {}}
                                     >
                    <ScrollView horizontal={false}>
                        <Text>{item}</Text> 
                        {/* {console.log("keys", dates().indexOf(item))} */}
                        {/* does not scroll !! */}
                        {/* need add keys to array */}
                    </ScrollView>              
                  </TouchableOpacity>   
              }         
          /> 
        </View> 

        <View style={styles.monthBox}>
          <FlatList 
              data={months}
              numColumns={1}
              renderItem={({item}) =>
                  <TouchableOpacity style={styles.item}
                                    key={months.indexOf(item)}
                                    // onPress={() => {}}
                                     >
                    <ScrollView horizontal={false}>
                        <Text>{item}</Text> 
                        {/* {console.log("keys", dates().indexOf(item))} */}
                        {/* does not scroll !! */}
                        {/* need add keys to array */}
                    </ScrollView>              
                  </TouchableOpacity>   
              }         
          /> 
        </View> 
      
        <View style={styles.yearBox}>
          <FlatList 
              data={years()}
              numColumns={1}
              renderItem={({item}) =>
                  <TouchableOpacity style={styles.item}
                                    key={years().indexOf(item)}
                                    // onPress={() => {}}
                                     >
                    <ScrollView horizontal={false}>
                        <Text>{item}</Text> 
                        {/* {console.log("keys", dates().indexOf(item))} */}
                        {/* does not scroll !! */}
                        {/* need add keys to array */}
                    </ScrollView>              
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
    width: "80%",
    margin: 50,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 10
  },
  dateBox:{
    padding:20,
    borderWidth: 2,
    borderColor: "grey"
  },
  yearBox:{
    padding: 20
  },
  monthBox:{
    padding: 20
  },
  item:{
    backgroundColor: 'white',
  }
});

