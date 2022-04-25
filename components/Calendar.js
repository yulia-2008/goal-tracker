import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';

export default function Calendar(props) {

  return (
    <View style={styles.container}>
     <Text>Calendar Container</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5
  }
});

