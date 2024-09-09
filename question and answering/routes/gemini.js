const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


const generateContent = async (req,res)=>{
    // let {question}=req.body
    const question="software engineer"
    try{
        const prompt = `you are a expert on ${question} craft 5 questions that the user will need to answer so that you could know his expertise send all questions in one go and you will get answers in next prompt`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.send(text);
    }
    catch(err){
        console.log(err);
        res.send("Unexpected Error!!!");
    }
}

module.exports = generateContent;