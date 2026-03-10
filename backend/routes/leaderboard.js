const express = require("express");
const router = express.Router();

/* TEMP DATA */

const leaderboard=[

{
_id:"user1",
totalScore:120
},

{
_id:"user2",
totalScore:90
},

{
_id:"user3",
totalScore:60
}

]

router.get("/",(req,res)=>{

res.json({
success:true,
leaderboard
})

})

module.exports = router;