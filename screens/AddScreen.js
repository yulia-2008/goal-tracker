import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

export default function AddScreen({navigation, route}) {

  const data = [
    "Mind: Personal Development",  
    "Body: Health & Fitness", 
    "Career",  
    "Relationship: Friends & Fam",  
    "Finance",  
    "Relaxation: Fun & Entertainment"
  ]
  const [area, updateArea] = useState(null)
  const [text, updateText] = useState("")
  
  return (  
     <View style={styles.container}>
            <SelectDropdown data={data}
                            buttonStyle={styles.dropdown}
                            onSelect={(selectedItem, index) => {
                              console.log("selected", selectedItem, index),
                              updateArea(selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item
                            }}
                          />
            <TextInput  autoFocus={true} 
                        placeholder="  goal...  " 
                        // onChangeText={text=>updateText(text)}
                        // onEndEditing={()=> addGoal()}
                        onEndEditing={text=> updateText(text)}
                        required
                        multiline={true}
                        style={styles.inputField}
                        /> 
          </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  dropdown:{
    backgroundColor:"grey",
    borderRadius:8,
    width:270,
    height:45, 
    margin:20,                             
    },
    inputField: {
      width: "80%",
      borderWidth: 2,
      borderColor: 'grey',
     }
    //  inputBox:{
    //   width: "100%",
    //   alignItems: 'center',
    //   borderWidth: 2,
    //   borderColor: 'red',
    //   margin: 20
    //  }
});

