import React,{useEffect,useState} from "react"
import {View,Text,FlatList} from "react-native"
import api from "../../services/api"

const LeaderboardScreen = ()=>{

const [data,setData] = useState([])

useEffect(()=>{

load()

},[])

const load = async()=>{

const res = await api.get("/leaderboard")
setData(res.data.leaderboard)

}

return(

<View>

<Text>Leaderboard</Text>

<FlatList
data={data}
keyExtractor={(item)=>item._id}
renderItem={({item,index})=>(

<View>

<Text>{index+1}. {item._id}</Text>
<Text>Score: {item.totalScore}</Text>

</View>

)}
/>

</View>

)

}

export default LeaderboardScreen