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




MAY BE NEED IT LATER: 

FlatList
onScroll={(event) => console.log("scroll:", event.nativeEvent)}
                        //  nativeEvent is object, has "contentOffset" property {x:0, y: 12 }
                        //  y value is the distance that the user has scrolled from the last position

