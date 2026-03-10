import React,{useEffect,useState} from "react"
import {View,Text,TouchableOpacity,FlatList} from "react-native"
import api from "../../services/api"

const ProblemListScreen = ({route,navigation})=>{

const {language} = route.params
const [problems,setProblems] = useState([])

useEffect(()=>{

loadProblems()

},[])

const loadProblems = async()=>{

const res = await api.get(`/problems?language=${language}`)
setProblems(res.data.problems)

}

return(

<View style={{flex:1}}>

<FlatList
data={problems}
keyExtractor={(item)=>item._id}
renderItem={({item})=>(

<TouchableOpacity
onPress={()=>navigation.navigate("ProblemDetail",{problemId:item._id})}
>

<Text>{item.title}</Text>
<Text>{item.difficulty}</Text>

</TouchableOpacity>

)}
/>

</View>

)

}

export default ProblemListScreen