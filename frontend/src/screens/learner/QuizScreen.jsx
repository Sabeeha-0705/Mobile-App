//frontend/src/screens/learner/QuizScreen.jsx
import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
ActivityIndicator,
Alert
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { courseAPI, progressAPI } from "../../services/api";

const QuizScreen = ({ route, navigation }) => {

const { courseId } = route.params;
const { theme } = useTheme();

const [questions,setQuestions] = useState([]);
const [answers,setAnswers] = useState({});
const [loading,setLoading] = useState(true);

useEffect(()=>{

fetchQuiz()

},[])

const fetchQuiz = async()=>{

try{

const res = await courseAPI.getCourse(courseId)

const quizQuestions = res.data.course?.quiz?.questions || []

setQuestions(quizQuestions)

}catch(err){

Alert.alert("Error","Quiz load failed")

}finally{

setLoading(false)

}

}

const selectOption = (qIndex,optIndex)=>{

setAnswers({
...answers,
[qIndex]:optIndex
})

}

const submitQuiz = async()=>{

let score = 0

questions.forEach((q,i)=>{

if(answers[i] === q.correctAnswer){

score++

}

})

try{

await progressAPI.submitQuiz({
courseId,
score,
totalQuestions:questions.length
})

Alert.alert(
"Quiz Completed",
`Score: ${score}/${questions.length}`,
[
{ text:"OK", onPress:()=>navigation.goBack() }
]
)

}catch(err){

Alert.alert("Error","Quiz submit failed")

}

}

if(loading){

return(
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<ActivityIndicator size="large" color={theme.primary}/>
</View>
)

}

if(questions.length === 0){

return(
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<Text>No quiz available</Text>
</View>
)

}

return(

<ScrollView style={{flex:1,backgroundColor:theme.background}}>

<View style={styles.container}>

<Text style={[styles.title,{color:theme.text}]}>
Course Quiz
</Text>

{questions.map((q,qIndex)=>(

<View key={qIndex} style={styles.questionCard}>

<Text style={[styles.question,{color:theme.text}]}>
{qIndex+1}. {q.question}
</Text>

{q.options.map((opt,optIndex)=>{

const selected = answers[qIndex] === optIndex

return(

<TouchableOpacity
key={optIndex}
style={[
styles.option,
{
backgroundColor:selected
? theme.primary
: theme.surface
}
]}
onPress={()=>selectOption(qIndex,optIndex)}
>

<Text
style={{
color:selected?"#fff":theme.text
}}
>
{opt}
</Text>

</TouchableOpacity>

)

})}

</View>

))}

<TouchableOpacity
style={[styles.submitBtn,{backgroundColor:theme.success}]}
onPress={submitQuiz}
>

<Text style={styles.submitText}>
Submit Quiz
</Text>

</TouchableOpacity>

</View>

</ScrollView>

)

}

const styles = StyleSheet.create({

container:{
padding:20
},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:20
},

questionCard:{
marginBottom:20
},

question:{
fontSize:16,
fontWeight:"600",
marginBottom:10
},

option:{
padding:12,
borderRadius:8,
marginBottom:8
},

submitBtn:{
padding:16,
borderRadius:10,
alignItems:"center",
marginTop:20
},

submitText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
}

})

export default QuizScreen;