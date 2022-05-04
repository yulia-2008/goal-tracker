need to be done:
- rename TimeRange (variable and button)
- keyboard layout
- text input is still in focus after selecting other butons
- if not all fields are filled and Set Goal pressed - what should happen?
- Add new Goal button text - make bigger
- Home Screen and LifeArea has different "Add Button" position???? Flex parametr is the same.

- date cell in Goal.js require key for each child.








const monthsYearsArray = () => {
        // creates array of objects [ {id: 0, month: {id: 0, name: janyary},...]
        let array = []
        let count = 0;
        for (let i = 2022; i <= 2040; i ++){
            monthArray.map(mo => {
                array.push({id: count, month: mo, year: i})
                count += 1
            })
        }                 
        return array    
    }



                <ScrollView >
                    { monthsYearsArray().map(obj => {
                        return  <View style={styles.month} key={obj.id}>
                                    <Text>{obj.month.name} - {obj.year}</Text>
                                    {getDates(obj.month.id, obj.year).map(date => {
                                        return  <TouchableOpacity key={date}>
                                                    <Text >
                                                        {date}
                                                    </Text>
                                                </TouchableOpacity>
                                                
                                    })}  
                                </View>       
                    })}
                </ScrollView>

