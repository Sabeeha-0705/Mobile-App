//backend/utils/judge0.js
const axios = require("axios");

const JUDGE0_URL =
"https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

exports.runCode = async (sourceCode, languageId) => {

const options = {
method: "POST",
url: JUDGE0_URL,
headers: {
"content-type": "application/json",
"X-RapidAPI-Key": process.env.JUDGE0_KEY,
"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
},
data: {
source_code: sourceCode,
language_id: languageId
}
};

const response = await axios.request(options);

return response.data;

};