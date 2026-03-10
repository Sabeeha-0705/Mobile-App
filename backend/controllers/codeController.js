//backend/controllers/codeController.js
const axios = require("axios");

exports.runCode = async (req, res) => {

  try {

    const { code, language } = req.body;

    const languageMap = {
      javascript: 63,
      python: 71,
      c: 50,
      cpp: 54,
      java: 62
    };

    const language_id = languageMap[language];

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: language_id
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      output: response.data.stdout || response.data.stderr
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};