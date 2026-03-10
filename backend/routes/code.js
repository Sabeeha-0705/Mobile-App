//backend/routes/code.js
const express = require("express");
const router = express.Router();

/* SIMPLE CODE EXECUTOR */

router.post("/run",(req,res)=>{

const {code,language} = req.body;

if(!code){

return res.status(400).json({
success:false,
message:"Code required"
})

}

try{

if(language==="javascript"){

const logs=[];

const customConsole={
log:(...args)=>logs.push(args.join(" "))
}

const func = new Function("console",code)

func(customConsole)

return res.json({
success:true,
output:logs.join("\n") || "Code executed successfully"
})

}

return res.json({
success:true,
output:"Language runtime not supported yet"
})

}catch(err){

return res.json({
success:false,
output:err.message
})

}

})

module.exports = router;