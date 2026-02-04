import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAmvetEwtejwpUfA_qZBbKJll6A7jRLbN4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generatePrompt = (skillInterest, testType, knowledgeLevel) => {
  return `Generate a ${testType} test for ${skillInterest} at ${knowledgeLevel} level. 
  ${getTestTypeSpecificPrompt(testType)}
  Format the response in JSON with the following structure based on test type:
  ${getExpectedResponseFormat(testType)}
  
  IMPORTANT: 
  1. Response MUST be valid JSON
  2. Response MUST match the exact structure shown above
  3. DO NOT include any explanatory text before or after the JSON
  4. DO NOT include markdown code blocks
  5. ONLY return the JSON object`;
};

const getTestTypeSpecificPrompt = (testType) => {
  switch (testType) {
    case 'Multiple Choice Questions':
      return 'Include 5 multiple choice questions with 4 options each. Each question should have a clear correct answer index (0-3).';
    case 'Coding Challenge':
      return 'Create 2 coding problems with clear requirements, example inputs/outputs, and test cases.';
    case 'Case Study':
      return 'Design a detailed case study with background, challenge, and specific requirements.';
    case 'Practical Implementation':
      return 'Create a practical implementation task with clear objectives, requirements, and expected deliverables.';
    default:
      return '';
  }
};

const getExpectedResponseFormat = (testType) => {
  switch (testType) {
    case 'Multiple Choice Questions':
      return `{
        "questions": [
          {
            "id": "number",
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": "number (0-3)"
          }
        ]
      }`;
    case 'Coding Challenge':
      return `{
        "questions": [
          {
            "id": "number",
            "problem": "string",
            "examples": [
              {
                "input": "string",
                "output": "string"
              }
            ],
            "testCases": [
              {
                "input": "string",
                "expected": "string"
              }
            ]
          }
        ]
      }`;
    case 'Case Study':
      return `{
        "questions": [
          {
            "id": "number",
            "title": "string",
            "background": "string",
            "challenge": "string",
            "requirements": ["string"]
          }
        ]
      }`;
    case 'Practical Implementation':
      return `{
        "questions": [
          {
            "id": "number",
            "title": "string",
            "description": "string",
            "requirements": ["string"],
            "expectedOutput": "string"
          }
        ]
      }`;
    default:
      return '{ "questions": [] }';
  }
};

const sanitizeAndParseJSON = (text) => {
  try {
    // Remove any markdown code block syntax
    text = text.replace(/```json/g, '').replace(/```/g, '');
    
    // Find the first occurrence of '{' and last occurrence of '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    
    if (start === -1 || end === 0) {
      throw new Error('No valid JSON object found in response');
    }
    
    // Extract the JSON portion
    const jsonStr = text.slice(start, end);
    
    // Parse the JSON
    const parsed = JSON.parse(jsonStr);
    
    // Validate the response structure
    if (!parsed.questions && !parsed.score) {
      throw new Error('Invalid response structure: missing required fields');
    }

    // For question generation
    if (parsed.questions) {
      if (!Array.isArray(parsed.questions)) {
        throw new Error('Invalid response structure: questions must be an array');
      }

      // Ensure each question has required fields based on type
      parsed.questions.forEach((question, index) => {
        if (!question.id) {
          question.id = index + 1; // Add missing IDs
        }
      });
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error(`Failed to parse API response: ${error.message}`);
  }
};

const generateEvaluationPrompt = (questions, userAnswers, testType) => {
  return `Evaluate these answers for a ${testType} test:
  Questions: ${JSON.stringify(questions)}
  User Answers: ${JSON.stringify(userAnswers)}
  
  Provide evaluation in this EXACT JSON format:
  {
    "score": number (0-100),
    "percentage": number (0-100),
    "feedback": "string with overall feedback",
    "detailedFeedback": [
      {
        "questionId": number,
        "correct": boolean,
        "explanation": "string explaining why correct/incorrect"
      }
    ]
  }
  
  IMPORTANT:
  1. Response MUST be valid JSON
  2. Response MUST match the exact structure shown above
  3. DO NOT include any text before or after the JSON
  4. DO NOT include markdown code blocks
  5. ONLY return the JSON object`;
};

export const generateQuestions = async (skillInterest, testType, knowledgeLevel) => {
  try {
    // Use a supported model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Updated model
    const prompt = generatePrompt(skillInterest, testType, knowledgeLevel);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return sanitizeAndParseJSON(text);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};


export const evaluateAnswers = async (questions, userAnswers, testType) => {
  try {
    if (!questions || questions.length === 0) {
      throw new Error('No questions to evaluate');
    }

    if (Object.keys(userAnswers).length === 0) {
      throw new Error('No answers provided for evaluation');
    }

    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Updated model

    const prompt = generateEvaluationPrompt(questions, userAnswers, testType);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsed = sanitizeAndParseJSON(text);
    
    // Validate evaluation response structure
    if (typeof parsed.score !== 'number' || 
        typeof parsed.percentage !== 'number' || 
        !Array.isArray(parsed.detailedFeedback) ||
        !parsed.feedback) {
      throw new Error('Invalid evaluation response structure');
    }
    
    return parsed;
  } catch (error) {
    console.error('Error evaluating answers:', error);
    throw new Error(`Failed to evaluate answers: ${error.message}`);
  }
};
