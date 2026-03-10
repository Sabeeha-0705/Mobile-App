import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const languages = ["javascript","python","cpp","java","c"];

const LanguagesScreen = ({navigation}) => {

return(

<View style={styles.container}>

<Text style={styles.title}>Select Language</Text>

{languages.map(lang=>(

<TouchableOpacity
key={lang}
style={styles.card}
onPress={()=>navigation.navigate("Problems",{language:lang})}
>

<Text style={styles.text}>{lang.toUpperCase()}</Text>

</TouchableOpacity>

))}

</View>

)

}

const styles = StyleSheet.create({

container:{flex:1,justifyContent:"center",alignItems:"center"},
title:{fontSize:24,marginBottom:20},
card:{padding:20,backgroundColor:"#eee",margin:10,width:200,alignItems:"center"},
text:{fontSize:18}

})

export default LanguagesScreen