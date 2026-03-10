import React,{useState} from "react"
import {View,TextInput,Button,Text} from "react-native"
import api from "../../services/api"

const CodeEditorScreen = ({route})=>{

const {problem} = route.params

const [code,setCode] = useState(problem.starterCode)
const [output,setOutput] = useState("")

const runCode = async()=>{

const res = await api.post("/code/run",{
code,
language:problem.language
})

setOutput(res.data.output)

}

return(

<View>

<TextInput
value={code}
onChangeText={setCode}
multiline
style={{height:200,borderWidth:1}}
/>

<Button title="Run Code" onPress={runCode}/>

<Text>{output}</Text>

</View>

)

}

export default CodeEditorScreen