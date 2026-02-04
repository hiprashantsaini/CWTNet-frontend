import { createContext, useContext, useState } from 'react';
import { evaluateAnswers, generateQuestions } from '../aiSkillTest/services/geminiService';

const TestContext = createContext(null);

export function TestProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const startTest = async (preferences) => {
    if (questions.length > 0) return; // Don't regenerate if questions exist
    
    setLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateQuestions(
        preferences.skillInterest,
        preferences.testType,
        preferences.knowledgeLevel
      );
      setQuestions(generatedQuestions.questions);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitTest = async () => {
    if (Object.keys(userAnswers).length === 0) {
      setError('No answers to evaluate. Please answer at least one question.');
      return null;
    }

    setIsEvaluating(true);
    setLoading(true);
    setError(null);

    try {
      const evaluationResults = await evaluateAnswers(
        questions,
        userAnswers,
        questions[0]?.type || 'Multiple Choice Questions'
      );

      setResults(evaluationResults);
      return evaluationResults;
    } catch (err) {
      setError('Failed to evaluate test. Please try again.');
      return null;
    } finally {
      setLoading(false);
      setIsEvaluating(false);
    }
  };

  const resetTest = () => {
    setQuestions([]);
    setUserAnswers({});
    setResults(null);
    setError(null);
    setIsEvaluating(false);
  };

  return (
    <TestContext.Provider
      value={{
        questions,
        userAnswers,
        results,
        loading,
        error,
        isEvaluating,
        startTest,
        submitAnswer,
        submitTest,
        resetTest
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
}