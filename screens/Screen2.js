import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Screen2({navigation, route}) {
  const goal = route.params.goalArea
  return (
    <View style={styles.container}>
      {console.log("screen 2", route.params)} 
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

