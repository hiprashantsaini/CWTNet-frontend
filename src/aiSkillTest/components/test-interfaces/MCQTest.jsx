import { useState } from 'react';
import { useTest } from '../../../context/TestContext';
import TestLayout from './TestLayout';

function MCQTest({ preferences, questions = [], onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { submitAnswer } = useTest();

  const handleAnswer = (answerIndex) => {
    submitAnswer(questions[currentQuestion].id, answerIndex);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete();
    }
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <TestLayout
      title={`Question ${currentQuestion + 1}/${questions.length}`}
      preferences={preferences}
      progress={(currentQuestion + 1) / questions.length * 100}
    >
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h3>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full text-left p-4 rounded-lg border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </TestLayout>
  );
}

export default MCQTest;