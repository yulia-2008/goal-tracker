import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

export default function Test({navigation}) {
  const [goalAreas, updateArea] = useState([
    {name: "Mind: Personal Development",  key: 1, goals: []},
    {name: "Body: Health & Fitness", key:2, goals: []},
    {name: "Career",  key: 3, goals: []},
    {name: "Relationship: Friends & Fam",  key: 4, goals: []},
    {name: "Finance",  key: 5, goals: []},
    {name: "Relaxation: Fun & Entertainment",  key: 6, goals: []}, 
  ])

  return (
    <View style={styles.container}>
      <View style={styles.itemBox}>
        <FlatList 
            data={goalAreas}
            numColumns={2}
            renderItem={({item}) =>
                <TouchableOpacity style={styles.item}
                                  onPress={() => {console.log("screen 1", item.name), navigation.navigate("Screen2", {area: item})}} >
                    <Text>{item.name}</Text>               
                </TouchableOpacity>   
            }         
        /> 
      </View> 
      <View style={styles.buttonBox}>
        <Text>Tap to set a new goal </Text>
        <TouchableOpacity style={styles.plusIcon}
                          // onPress={}
        >
          <Text>+</Text>
        </TouchableOpacity>    
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: 'red' 
  },
  item: {
    backgroundColor: '#ffc',
    width: 170,                                      
    height: 90,
    margin: 10,
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: 'grey' 
  },
  plusIcon: {
    width: 27,                                      
    height: 22,
    backgroundColor: 'yellow',
    alignItems: 'center'
  },
  itemBox:{
    flex:2,
    width: "100%",
    borderWidth: 2,
    borderColor: 'green'
   },
  buttonBox: {
    flex:1,
    width: "100%",
    borderWidth: 3,
    borderColor: 'blue',
    alignItems: 'center'
   }
});

