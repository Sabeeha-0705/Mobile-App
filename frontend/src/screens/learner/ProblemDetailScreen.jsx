import React,{useEffect,useState} from "react"
import {View,Text,Button} from "react-native"
import api from "../../services/api"

const ProblemDetailScreen = ({route,navigation})=>{

const {problemId} = route.params
const [problem,setProblem] = useState(null)

useEffect(()=>{

loadProblem()

},[])

const loadProblem = async()=>{

const res = await api.get(`/problems/${problemId}`)
setProblem(res.data.problem)

}

if(!problem) return null

return(

<View>

<Text>{problem.title}</Text>
<Text>{problem.description}</Text>

<Button
title="Solve Problem"
onPress={()=>navigation.navigate("CodeEditor",{problem})}
/>

</View>

)

}

export default ProblemDetailScreen