import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Screen2({navigation, route}) {
  const goalArea = route.params.area 
  return (
    <View style={styles.container}>
      <Text>Screen 2</Text>
      <Text>{goalArea.name}</Text>
        {console.log("screen 2", goalArea.name)}     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

