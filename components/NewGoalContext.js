import React from 'react';
  
const newGoalContext = React.createContext({buttonClicked: false});
// It's an object with 2 values: { Provider, Consumer }
// I use Provider in App.js return() 
console.log("in context", newGoalContext.buttonClicked)
export default newGoalContext