const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const generateCertificatePDF = require("../utils/generateCertificatePDF");


/* ---------------- GET ALL CERTIFICATES ---------------- */

router.get('/', protect, async (req, res) => {

  try {

    const certificates = await Certificate.find({
      userId: req.user.id
    })
    .populate('courseId')
    .sort({ issueDate: -1 });

    res.json({
      success:true,
      certificates
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

});


/* ---------------- GENERATE CERTIFICATE ---------------- */

router.post('/generate/:courseId', protect, async (req,res)=>{

  try{

    const progress = await Progress.findOne({
      userId:req.user.id,
      courseId:req.params.courseId
    });

    if(!progress || !progress.isCompleted){

      return res.status(400).json({
        success:false,
        message:"Complete course first"
      })

    }

    if(!progress.quizScore || !progress.quizScore.passed){

      return res.status(400).json({
        success:false,
        message:"Quiz not passed"
      })

    }

    const existingCertificate = await Certificate.findOne({
      userId:req.user.id,
      courseId:req.params.courseId
    });

    if(existingCertificate){

      return res.json({
        success:true,
        certificate:existingCertificate,
        certificateUrl:existingCertificate.verificationUrl
      })

    }

    const course = await Course.findById(req.params.courseId);

    const quizPercentage =
    (progress.quizScore.score / progress.quizScore.totalQuestions)*100

    let grade="Pass";

    if(quizPercentage>=90) grade="Excellent"
    else if(quizPercentage>=80) grade="Very Good"
    else if(quizPercentage>=70) grade="Good"

    const certificate = await Certificate.create({

      userId:req.user.id,
      courseId:req.params.courseId,
      studentName:req.user.fullName,
      courseName:course.title,
      grade,
      skills:[course.category]

    });

    certificate.verificationUrl =
    `http://10.15.231.162:5000/api/certificates/verify/${certificate.certificateId}`

    await certificate.save()

    res.json({
      success:true,
      certificate,
      certificateUrl:certificate.verificationUrl
    })

  }
  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    })

  }

})


/* ---------------- VERIFY CERTIFICATE ---------------- */

router.get('/verify/:certificateId', async (req,res)=>{

  try{

    const certificate = await Certificate.findOne({
      certificateId:req.params.certificateId
    })
    .populate('courseId')
    .populate('userId','fullName email')

    if(!certificate){

      return res.status(404).json({
        success:false,
        message:"Certificate not found"
      })

    }

    res.json({
      success:true,
      certificate,
      valid:true
    })

  }
  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    })

  }

})


/* ---------------- DOWNLOAD PDF ---------------- */

router.get("/download/:certificateId", async (req, res) => {

  try {

    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
    });

    if (!certificate) {

      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });

    }

    generateCertificatePDF(res, certificate);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});


module.exports = router;