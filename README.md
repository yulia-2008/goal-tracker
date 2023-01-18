need to be done:
- rename TimeRange (variable and button)
- keyboard layout
- text input is still in focus after selecting other butons
- if not all fields are filled and Set Goal pressed - what should happen?
- Add new Goal button text - make bigger
- Home Screen and LifeArea has different "Add Button" position???? Flex parametr is the same.
- in calendar: render current month and does not let scroll back; after first time scrolling down the list automaticly scrolls up
!!! initialScrollIndex disables the "scroll to top" optimization that keeps the first initialNumToRender items always rendered and immediately renders the items starting at this initial index
- change dedline conteiner for Modal Pop-up

- decided not to go with initialScrollIndex in FlatList.

- Working on date pressed function, need to implement:
    + accomplished or not accomplished dates stores in Async.
    + getDates function should take info from Async
    + style color changing after set goal as accomplished.

 - Changes FlatList for ScrollView and .map method. Work but slow, need to descreese amount of years, may be 5 years range only. Current month button did not work, something with ref. 







MAY BE NEED IT LATER: 

FlatList
onScroll={(event) => console.log("scroll:", event.nativeEvent)}
                        //  nativeEvent is object, has "contentOffset" property {x:0, y: 12 }
                        //  y value is the distance that the user has scrolled from the last position





2023: get back to this app. Planning to finish and refactor.
- delete areas
- all goals will be on home streen
- when open a goal -> calendar 