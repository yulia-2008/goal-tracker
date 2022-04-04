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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'center',
  }
});