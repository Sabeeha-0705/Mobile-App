import React, { useEffect, useState } from 'react';
import {
View,
Text,
ScrollView,
StyleSheet,
TouchableOpacity,
ActivityIndicator,
Linking
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { certificateAPI } from '../../services/api.jsx';

const CertificatesScreen = () => {

const { theme } = useTheme();

const [certificates,setCertificates] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{
fetchCertificates();
},[])

const fetchCertificates = async()=>{

try{

const response = await certificateAPI.getAllCertificates();

setCertificates(response.data.certificates || []);

}catch(error){

console.log(error)

}finally{

setLoading(false)

}

}

const openCertificate = async(url)=>{

if(!url){

alert("Certificate URL not found");
return;

}

try{

await Linking.openURL(url);

}catch(error){

alert("Unable to open certificate")

}

}

/* -------- DOWNLOAD PDF -------- */

const downloadPDF = async(certificateId)=>{

try{

const url =
`http://10.15.231.162:5000/api/certificates/download/${certificateId}`

await Linking.openURL(url)

}catch(err){

alert("Unable to download certificate")

}

}

if(loading){

return(

<View style={[styles.container,{backgroundColor:theme.background}]}>
<ActivityIndicator size="large" color={theme.primary} style={{marginTop:100}}/>
</View>

)

}

return(

<ScrollView style={[styles.container,{backgroundColor:theme.background}]}>

<View style={styles.header}>

<Ionicons name="ribbon" size={48} color={theme.primary}/>

<Text style={[styles.headerTitle,{color:theme.text}]}>
My Certificates
</Text>

<Text style={[styles.headerSubtitle,{color:theme.textSecondary}]}>
{certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
</Text>

</View>

{certificates.length === 0 ? (

<View style={[styles.emptyCard,{backgroundColor:theme.surface}]}>

<Ionicons name="ribbon-outline" size={64} color={theme.textSecondary}/>

<Text style={[styles.emptyText,{color:theme.textSecondary}]}>
No certificates yet
</Text>

<Text style={[styles.emptySubtext,{color:theme.textSecondary}]}>
Complete courses to earn certificates
</Text>

</View>

) : (

certificates.map(cert=>(

<View
key={cert._id}
style={[styles.certCard,{backgroundColor:theme.card}]}
>

<TouchableOpacity
onPress={()=>openCertificate(cert.verificationUrl)}
style={{flexDirection:"row"}}
>

<View
style={[
styles.certIcon,
{backgroundColor:theme.primary + "20"}
]}
>

<Ionicons name="ribbon" size={32} color={theme.primary}/>

</View>

<View style={styles.certInfo}>

<Text style={[styles.certCourse,{color:theme.text}]}>
{cert.courseName}
</Text>

<Text style={[styles.certId,{color:theme.textSecondary}]}>
ID: {cert.certificateId}
</Text>

<Text style={[styles.certDate,{color:theme.textSecondary}]}>
Completed: {new Date(cert.completionDate).toLocaleDateString()}
</Text>

{cert.grade && (

<View
style={[
styles.gradeBadge,
{backgroundColor:theme.success + "20"}
]}
>

<Text style={[styles.gradeText,{color:theme.success}]}>
{cert.grade}
</Text>

</View>

)}

</View>

</TouchableOpacity>

{/* -------- DOWNLOAD BUTTON -------- */}

<TouchableOpacity
style={[styles.downloadBtn,{backgroundColor:theme.primary}]}
onPress={()=>downloadPDF(cert.certificateId)}
>

<Ionicons name="download" size={18} color="#fff"/>

<Text style={styles.downloadText}>
Download PDF
</Text>

</TouchableOpacity>

</View>

))

)}

</ScrollView>

)

}

const styles = StyleSheet.create({

container:{flex:1},

header:{
alignItems:"center",
padding:30
},

headerTitle:{
fontSize:24,
fontWeight:"bold",
marginTop:15
},

headerSubtitle:{
fontSize:16,
marginTop:5
},

emptyCard:{
margin:20,
padding:40,
borderRadius:15,
alignItems:"center"
},

emptyText:{
fontSize:18,
fontWeight:"600",
marginTop:15
},

emptySubtext:{
fontSize:14,
marginTop:5,
textAlign:"center"
},

certCard:{
margin:15,
marginTop:0,
padding:15,
borderRadius:12,
elevation:2
},

certIcon:{
width:60,
height:60,
borderRadius:12,
justifyContent:"center",
alignItems:"center"
},

certInfo:{
flex:1,
marginLeft:15
},

certCourse:{
fontSize:16,
fontWeight:"600",
marginBottom:6
},

certId:{
fontSize:13,
marginBottom:4
},

certDate:{
fontSize:13
},

gradeBadge:{
marginTop:8,
paddingHorizontal:10,
paddingVertical:4,
borderRadius:6,
alignSelf:"flex-start"
},

gradeText:{
fontSize:13,
fontWeight:"600"
},

downloadBtn:{
marginTop:10,
flexDirection:"row",
alignItems:"center",
justifyContent:"center",
padding:10,
borderRadius:8
},

downloadText:{
color:"#fff",
marginLeft:6,
fontWeight:"600"
}

})

export default CertificatesScreen;