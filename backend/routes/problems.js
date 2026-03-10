//backend/routes/problems.js
const express = require("express");
const router = express.Router();

/* TEMP SAMPLE PROBLEMS */

const problems = [

{
_id:"1",
title:"Reverse String",
language:"javascript",
difficulty:"easy",
description:"Reverse a string",
starterCode:`function reverseString(str){

}`,
points:10
},

{
_id:"2",
title:"Palindrome Check",
language:"javascript",
difficulty:"easy",
description:"Check palindrome",
starterCode:`function isPalindrome(str){

}`,
points:10
},

{
_id:"3",
title:"Factorial",
language:"javascript",
difficulty:"easy",
description:"Find factorial",
starterCode:`function factorial(n){

}`,
points:10
}

];


/* GET ALL PROBLEMS */

router.get("/", (req,res)=>{

const {language} = req.query;

let result = problems;

if(language){

result = problems.filter(p=>p.language===language)

}

res.json({
success:true,
problems:result
})

})


/* GET SINGLE PROBLEM */

router.get("/:id",(req,res)=>{

const problem = problems.find(p=>p._id===req.params.id)

if(!problem){

return res.status(404).json({
success:false,
message:"Problem not found"
})

}

res.json({
success:true,
problem
})

})


module.exports = router;