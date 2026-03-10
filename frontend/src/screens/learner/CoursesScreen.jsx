import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { courseAPI } from '../../services/api.jsx';

const CoursesScreen = ({ navigation }) => {

  const { theme } = useTheme();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // category + icon
  const categories = [
    {name:'All',icon:'apps'},
    {name:'Programming',icon:'code-slash'},
    {name:'Mobile Development',icon:'phone-portrait'},
    {name:'Backend Development',icon:'server'},
    {name:'Database',icon:'albums'}
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedCategory, courses]);

  const fetchCourses = async () => {

    try {

      const response = await courseAPI.getAllCourses();
      setCourses(response.data.courses || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const filterCourses = () => {

    let filtered = courses;

    if (selectedCategory !== 'All') {

      filtered = filtered.filter(c => c.category === selectedCategory);

    }

    if (searchQuery) {

      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

    }

    setFilteredCourses(filtered);

  };

  if (loading) {

    return (
      <View style={[styles.container,{backgroundColor:theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary}/>
      </View>
    );

  }

  return (

    <View style={[styles.container,{backgroundColor:theme.background}]}>

      {/* SEARCH */}

      <View style={styles.searchContainer}>

        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon}/>

        <TextInput
          style={[styles.searchInput,{backgroundColor:theme.surface,color:theme.text}]}
          placeholder="Search courses..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

      </View>

      {/* CATEGORY CARDS */}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>

        {categories.map(cat=>(

          <TouchableOpacity
            key={cat.name}
            style={[
              styles.categoryCard,
              {backgroundColor:selectedCategory===cat.name?theme.primary:theme.surface}
            ]}
            onPress={()=>setSelectedCategory(cat.name)}
          >

            <Ionicons
              name={cat.icon}
              size={28}
              color={selectedCategory===cat.name?"#fff":theme.primary}
            />

            <Text style={{
              color:selectedCategory===cat.name?"#fff":theme.text,
              marginTop:6,
              fontWeight:"600",
              fontSize:13,
              textAlign:"center"
            }}>
              {cat.name}
            </Text>

          </TouchableOpacity>

        ))}

      </ScrollView>

      {/* COURSES */}

      <ScrollView style={styles.coursesList}>

        <Text style={[styles.resultText,{color:theme.textSecondary}]}>
          {filteredCourses.length} courses found
        </Text>

        {filteredCourses.map(course=>(

          <TouchableOpacity
            key={course._id}
            style={[styles.courseCard,{backgroundColor:theme.card}]}
            onPress={()=>navigation.navigate("CourseDetail",{courseId:course._id})}
          >

            <View style={[styles.thumbnail,{backgroundColor:theme.primary}]}>
              <Ionicons name="book" size={30} color="#fff"/>
            </View>

            <View style={styles.courseContent}>

              <Text style={[styles.courseTitle,{color:theme.text}]}>
                {course.title}
              </Text>

              <Text style={[styles.courseDesc,{color:theme.textSecondary}]}>
                {course.description}
              </Text>

              <Text style={{color:theme.primary,fontSize:12,marginTop:4}}>
                {course.category}
              </Text>

            </View>

            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary}/>

          </TouchableOpacity>

        ))}

      </ScrollView>

    </View>

  );

};

const styles = StyleSheet.create({

container:{flex:1},

searchContainer:{
flexDirection:'row',
alignItems:'center',
padding:15
},

searchIcon:{
position:'absolute',
left:25
},

searchInput:{
flex:1,
paddingLeft:40,
padding:12,
borderRadius:10
},

categoriesContainer:{
paddingHorizontal:15,
marginBottom:10
},

categoryCard:{
width:110,
height:80,
borderRadius:12,
justifyContent:"center",
alignItems:"center",
marginRight:10
},

coursesList:{
flex:1,
paddingHorizontal:15
},

resultText:{
marginBottom:10
},

courseCard:{
flexDirection:"row",
padding:14,
borderRadius:12,
marginBottom:12,
elevation:2
},

thumbnail:{
width:60,
height:60,
borderRadius:10,
justifyContent:"center",
alignItems:"center"
},

courseContent:{
flex:1,
marginLeft:12
},

courseTitle:{
fontSize:16,
fontWeight:"600"
},

courseDesc:{
fontSize:13,
marginTop:2
}

});

export default CoursesScreen;