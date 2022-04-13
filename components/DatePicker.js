import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function DatePicker() {
  
  return (
    <View style={styles.container}>
      {console.log("datepicker")} 
      <Text>Here is a DatePicker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

