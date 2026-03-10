//backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const app = express();

/* ---------------- CORS ---------------- */
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

/* ---------------- BODY ---------------- */
app.use(express.json({limit:"500mb"}));
app.use(express.urlencoded({extended:true,limit:"500mb"}));

/* ---------------- SESSION ---------------- */
app.use(session({
  secret: process.env.JWT_SECRET || "session-secret",
  resave:false,
  saveUninitialized:false,
  cookie:{secure:false}
}));

/* ---------------- PASSPORT ---------------- */
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

/* ---------------- MONGODB ---------------- */
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/eduoding",
  {
    useNewUrlParser:true,
    useUnifiedTopology:true
  }
)
.then(()=>console.log("✅ MongoDB Connected Successfully"))
.catch(err=>console.log("❌ MongoDB Error:",err));

/* ---------------- ROUTES ---------------- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/courses', require('./routes/course'));
app.use('/api/videos', require('./routes/video'));
app.use('/api/notes', require('./routes/note'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/certificates', require('./routes/certificate'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/uploader', require('./routes/uploader'));
app.use("/api/problems", require("./routes/problems"));
app.use("/api/code", require("./routes/code"));
app.use("/api/leaderboard", require("./routes/leaderboard"));

/* ---------------- HEALTH ---------------- */
app.get('/',(req,res)=>{
  res.json({
    success:true,
    message:"Eduoding API running",
    version:"2.0"
  })
})

/* ---------------- ERROR ---------------- */
app.use((err,req,res,next)=>{
  console.log(err)
  res.status(500).json({
    success:false,
    message:err.message
  })
})

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`🚀 Server running on port ${PORT}`)
});