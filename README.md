need to be done:
- rename TimeRange (variable and button)
- keyboard layout
- text input is still in focus after selecting other butons
- if not all fields are filled and Set Goal pressed - what should happen?
- Add new Goal button text - make bigger
- Home Screen and LifeArea has different "Add Button" position???? Flex parametr is the same.

- working in a Goal Screen. FlatList inside of ScrollView is not allowed, had errors. Need to be fixed.


export default function Goal({navigation, route}) {

    const goal = route.params.goalObject;
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const [displayedMonth, setMonth] = useState(currentMonth)
    const [displayedYear, setYear] = useState(currentYear)

    const monthArray = ['January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August', 'September',
                        'October', 'November', 'December']

    const weekDays = () => {
        let days = new Array("Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"); 
        let daysWithKeys = []
        for (let i = 0; i < days.length; i++){
            daysWithKeys.push({id: i, day: days[i]})
        }
        return daysWithKeys
    }

    const monthsAndYearsArray = () => {
        let array = []
        for (let i = 2022; i <= 2040; i ++){
            monthArray.map(mo => {
                array.push([mo, i])
            })
        }                 
        return array    // creates nested array [[janyary, 2022], [february, 2022],...]
    }

    const getDays = () => {
        
        let daysCount = new Date(displayedYear, displayedMonth, 0).getDate();  
                // getDate() return 30 or 31 day, third parameter represents date (1-31),
                // parameter 0 ->  last day of the previos month (will be 30 or 31)
                // Months start with index 0, so the previous month is the needed month          
        let firstDay = new Date(displayedYear, displayedMonth, 1).getDay()  
        let daysArray = [];
        let daysArrayWithKeys = []

        for (let i = 1; i <= daysCount; i++) {
            daysArray.push(i);
        }

        switch (firstDay) {
            case 0:
                daysArray.unshift("", "", "", "", "", "");
                break;
            case 2:
                daysArray.unshift("");
                break;
            case 3:
                daysArray.unshift("", "");
                break;
            case 4:
                daysArray.unshift("", "", "");
                break;
            case 5:
                daysArray.unshift("", "", "", "");
                break;
            case 6:
                daysArray.unshift("", "", "", "", "");

                // If the 1st day of the month starts not on Monday 
                // push "" to the begining of the daysArray 
            }
            for(var i = 0; i <= daysArray.length; i++){
                daysArrayWithKeys.push({id: i, date: daysArray[i]});
            }
                 
      return daysArrayWithKeys
    }
    
    return (
        <View style={styles.container}>  
            <Text>{goal.text}  </Text> 
            <Text> Deadline: {goal.month} / {goal.date} / {goal.year} </Text>
            <Text> Pereodicity: {goal.timeRange} </Text>

            <View style={styles.calendarBox}>
                {/* <View style={{height: '10%', alignItems: 'center'}}>  */}
                    {/* need to wrap ScrollView with View for controlling the height */}
                    {/* <ScrollView horizontal={true}> */}
                                
                                
                        

                    
                    {/* </ScrollView> */}
                {/* </View>  */}
                <View style={styles.calendarHeader}>
                    { weekDays().map(item => {
                        return  <TouchableOpacity style={styles.weekDayBox} key={item.id}>
                                    <Text>{item.day}</Text>
                                </TouchableOpacity> 
                      })
                    }
                    
                </View> 
                <Text style={styles.month}>
                            {monthArray[currentMonth] + " " +  currentYear}
                </Text> 
                
                <FlatList 
                    contentContainerStyle = {styles.datesBox} // can not use justifyContent with FlatList styles
                    data={getDays()}
                    numColumns={7}
                    renderItem={({item}) =>
                        <TouchableOpacity  
                            style={styles.date}
                            // key={getDays().indexOf(item)}
                            key={item.id}
                            onPress={() => {
                                console.log("date pressed")
                            }}>
                        <Text>{item.date}</Text>                                        
                        </TouchableOpacity>   
                    }
                /> 
             
            </View>                           
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:3,
    padding: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
  },
  calendarBox: {
    flex:1,
    width: '90%',
    margin: '5%',
    backgroundColor: 'white',
    
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5
  },
  calendarHeader:{
    justifyContent: 'space-around', // gorizontally
    width: '100%',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: "red",
    alignItems: 'stretch'
  },
  weekDayBox:{
    width: '14%',
    borderWidth: 2,
    borderColor: "blue",
    padding: '2%',
    alignItems: 'center'
  },
  month: {
    width: '100%',
    padding: '4%',
    // alignSelf: 'center', 
    textAlign: 'center',
    fontWeight: 'bold',
    // marginRight: 280,
    borderWidth: 2,
    borderColor: "blue",
  },
  datesBox: {
    flex: 1,
    width: '100%',
    borderWidth: 2,
    borderColor: "pink",
    justifyContent: 'space-around', // vertically
    alignItems: 'stretch'           // gorizontally
  }, 
  date: {
    alignItems: 'center',   // gorizontally
    padding: '4%',
    margin: 1,
    width: '14%',
    borderWidth: 2,
    borderColor: "grey",
  }
});