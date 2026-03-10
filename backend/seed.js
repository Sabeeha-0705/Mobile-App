require("dotenv").config();
const mongoose = require("mongoose");

const Course = require("./models/Course");
const Video = require("./models/Video");
const User = require("./models/User");

const sampleCourses = [

{
title:"JavaScript for Beginners",
description:"Learn JavaScript fundamentals",
category:"Web Development",
level:"Beginner",
thumbnail:"https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg",
isPaid:false,
duration:"8 hours",

quiz:{
questions:[

{
question:"Which keyword declares a variable?",
options:["var","int","define","letvar"],
correctAnswer:0,
explanation:"JavaScript variables can be declared using var, let or const"
},

{
question:"Which symbol is used for comments?",
options:["//","#","<!--","**"],
correctAnswer:0,
explanation:"// is used for single line comments"
}

],
passingScore:70
}

},

{
title:"Python for Beginners",
description:"Learn Python from scratch",
category:"Programming",
level:"Beginner",
thumbnail:"https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
isPaid:false,
duration:"10 hours",

quiz:{
questions:[

{
question:"Which keyword defines a function?",
options:["def","function","fun","define"],
correctAnswer:0,
explanation:"def keyword defines function"
},

{
question:"Which type is [] ?",
options:["list","tuple","dict","set"],
correctAnswer:0,
explanation:"[] creates list"
}

],
passingScore:70
}

}

];

const sampleVideos = {

"JavaScript for Beginners":[
{
title:"Intro to JavaScript",
videoUrl:"https://www.youtube.com/watch?v=W6NZfCO5SIk",
duration:"15:00",
order:1
},
{
title:"Variables",
videoUrl:"https://www.youtube.com/watch?v=edlFjlzxkSI",
duration:"20:00",
order:2
}
],

"Python for Beginners":[
{
title:"Python Basics",
videoUrl:"https://www.youtube.com/watch?v=rfscVS0vtbw",
duration:"30:00",
order:1
},
{
title:"Control Flow",
videoUrl:"https://www.youtube.com/watch?v=HZARImviDxg",
duration:"28:00",
order:2
}
]

};

const seedDatabase = async()=>{

try{

await mongoose.connect(process.env.MONGODB_URI)

console.log("MongoDB Connected")

await Course.deleteMany()
await Video.deleteMany()

let instructor = await User.findOne({email:"instructor@eduoding.com"})

if(!instructor){

instructor = await User.create({

fullName:"Eduoding Instructor",
email:"instructor@eduoding.com",
password:"instructor123",
role:"uploader",
isEmailVerified:true

})

}

for(const courseData of sampleCourses){

const course = await Course.create({

...courseData,
instructor:instructor._id,
instructorName:instructor.fullName

})

const videos = sampleVideos[course.title] || []

for(const videoData of videos){

const video = await Video.create({

...videoData,
courseId:course._id,
thumbnail:course.thumbnail

})

course.videos.push(video._id)

}

await course.save()

}

console.log("Database Seeded Successfully")

process.exit()

}catch(err){

console.log(err)

process.exit(1)

}

}

seedDatabase()