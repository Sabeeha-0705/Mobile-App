const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("./models/Course");
const Video = require("./models/Video");

const instructorId = new mongoose.Types.ObjectId("65f1a7c9a4b1c2d3e4f56789");

const coursesData = [
{
title: "JavaScript Mastery",
description: "Complete JavaScript course",
thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg",
instructor: instructorId,
category: "Programming"
},
{
title: "React Native Complete",
description: "Build mobile apps using React Native",
thumbnail: "https://img.youtube.com/vi/0-S5a0eXPoc/hqdefault.jpg",
instructor: instructorId,
category: "Mobile Development"
},
{
title: "Python for Beginners",
description: "Learn Python from scratch",
thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
instructor: instructorId,
category: "Programming"
},
{
title: "Node.js Backend Development",
description: "Learn Node.js backend",
thumbnail: "https://img.youtube.com/vi/TlB_eWDSMt4/hqdefault.jpg",
instructor: instructorId,
category: "Backend Development"
},
{
title: "MongoDB Database Mastery",
description: "Master MongoDB database",
thumbnail: "https://img.youtube.com/vi/ExcRbA7fy_A/hqdefault.jpg",
instructor: instructorId,
category: "Database"
}
];

const lessons = {

"JavaScript Mastery":[
{title:"Introduction to JavaScript",videoUrl:"https://www.youtube.com/watch?v=W6NZfCO5SIk",duration:"15:00"},
{title:"Variables and Data Types",videoUrl:"https://www.youtube.com/watch?v=edlFjlzxkSI",duration:"20:00"},
{title:"Functions in JavaScript",videoUrl:"https://www.youtube.com/watch?v=N8ap4k_1QEQ",duration:"18:00"},
{title:"Arrays and Objects",videoUrl:"https://www.youtube.com/watch?v=oigfaZ5ApsM",duration:"22:00"},
{title:"Async JavaScript",videoUrl:"https://www.youtube.com/watch?v=PoRJizFvM7s",duration:"25:00"}
],

"React Native Complete":[
{title:"Setting up React Native",videoUrl:"https://www.youtube.com/watch?v=0-S5a0eXPoc",duration:"25:00"},
{title:"Core Components",videoUrl:"https://www.youtube.com/watch?v=ur6I5m2nTvk",duration:"22:00"},
{title:"Navigation in React Native",videoUrl:"https://www.youtube.com/watch?v=nQVCkqvU1uE",duration:"20:00"},
{title:"State Management",videoUrl:"https://www.youtube.com/watch?v=Hf4MJH0jDb4",duration:"24:00"},
{title:"API Integration",videoUrl:"https://www.youtube.com/watch?v=0-S5a0eXPoc",duration:"21:00"}
],

"Python for Beginners":[
{title:"Python Basics",videoUrl:"https://www.youtube.com/watch?v=rfscVS0vtbw",duration:"30:00"},
{title:"Control Flow",videoUrl:"https://www.youtube.com/watch?v=HZARImviDxg",duration:"28:00"},
{title:"Functions",videoUrl:"https://www.youtube.com/watch?v=9Os0o3wzS_I",duration:"24:00"},
{title:"Modules and Packages",videoUrl:"https://www.youtube.com/watch?v=CqvZ3vGoGs0",duration:"20:00"},
{title:"Python Project",videoUrl:"https://www.youtube.com/watch?v=_uQrJ0TkZlc",duration:"35:00"}
],

"Node.js Backend Development":[
{title:"Node.js Introduction",videoUrl:"https://www.youtube.com/watch?v=TlB_eWDSMt4",duration:"18:00"},
{title:"Express Basics",videoUrl:"https://www.youtube.com/watch?v=L72fhGm1tfE",duration:"20:00"},
{title:"REST APIs",videoUrl:"https://www.youtube.com/watch?v=pKd0Rpw7O48",duration:"25:00"},
{title:"Authentication with JWT",videoUrl:"https://www.youtube.com/watch?v=mbsmsi7l3r4",duration:"23:00"},
{title:"Deploy Node App",videoUrl:"https://www.youtube.com/watch?v=71wSzpLyW9k",duration:"22:00"}
],

"MongoDB Database Mastery":[
{title:"MongoDB Introduction",videoUrl:"https://www.youtube.com/watch?v=ExcRbA7fy_A",duration:"18:00"},
{title:"Collections and Documents",videoUrl:"https://www.youtube.com/watch?v=ofme2o29ngU",duration:"20:00"},
{title:"MongoDB Queries",videoUrl:"https://www.youtube.com/watch?v=-56x56UppqQ",duration:"21:00"},
{title:"Indexes in MongoDB",videoUrl:"https://www.youtube.com/watch?v=R2S0Y9Y6dTw",duration:"19:00"},
{title:"MongoDB Atlas Setup",videoUrl:"https://www.youtube.com/watch?v=kpI0F2xV3Xw",duration:"22:00"}
]

};

async function seedCourses(){

try{

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

await mongoose.connect(mongoUri);

console.log("MongoDB Connected");

await Course.deleteMany();
await Video.deleteMany();

console.log("Old data deleted");

for(const courseData of coursesData){

const course = await Course.create(courseData);

const courseLessons = lessons[courseData.title] || [];

if(courseLessons.length === 0){
console.log(`No lessons found for ${courseData.title}`);
continue;
}

for(let i=0;i<courseLessons.length;i++){

const videoId = courseLessons[i].videoUrl.split("v=")[1];

await Video.create({
title: courseLessons[i].title,
videoUrl: courseLessons[i].videoUrl,
thumbnail:`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
duration: courseLessons[i].duration,
courseId: course._id,
order: i+1,
isPreview: i===0
});

}

}

console.log("Courses and Lessons Seeded Successfully");

process.exit();

}catch(error){

console.error(error);
process.exit(1);

}

}

seedCourses();