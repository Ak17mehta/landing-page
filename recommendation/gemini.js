const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const courses = {
  "Data Science": [
    "Introduction to Data Science",
    "Machine Learning Fundamentals",
    "Deep Learning with TensorFlow",
  ],
  "Cyber Security": [
    "Cybersecurity Basics",
    "Advanced Network Security",
    "Penetration Testing",
  ],
  "React Developer": [
    "React for Beginners",
    "Building Single Page Apps with React",
    "Advanced React Patterns",
  ],
  // Add more courses as needed
};

const generateContent = async (req, res) => {
  const { step, field, answers } = req.body;

  try {
    if (step === "questions") {
      // Generate short (10-20 word) questions based on user's field
      const prompt = `You are an expert in ${field}. Generate 5 short (10-20 word) questions to assess the user's familiarity with ${field}. The questions should be direct and concise, focusing on evaluating their knowledge and practical experience without providing any extra details. Only questions should be returned.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.json({ questions: text }); // Send questions back as JSON
    } else if (step === "answers") {
      // Assess user's knowledge based on their answers
      const prompt = `Given these answers to questions in ${field}: "${answers}", assess the user's knowledge level (beginner, intermediate, advanced) and suggest relevant courses in ${field}. Provide no more than 3 sentences for the assessment.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Provide dummy course recommendations from our data
      const recommendedCourses = courses[field] || [
        "No courses available for this field",
      ];

      res.json({ analysis: text, recommendations: recommendedCourses }); // Send analysis and recommendations as JSON
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unexpected Error!" }); // Send error response as JSON
  }
};

module.exports = generateContent;
