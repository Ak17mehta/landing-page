const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateContent = async (req, res) => {
  const userPrompt = req.body.prompt; // Get the user's prompt from the request body
  console.log(userPrompt)
  try {
    // Use the user's prompt in the API request
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();
    res.send(text); // Send the generated content back to the frontend
  } catch (err) {
    console.log(err);
    res.status(500).send("Unexpected Error!");
  }
};

module.exports = generateContent;
