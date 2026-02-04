import React, { useState } from 'react';
import TestLayout from './TestLayout';

function CodingTest({ preferences, questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCode('');
    } else {
      onComplete();
    }
  };

  return (
    <TestLayout
      title={`Coding Challenge ${currentQuestion + 1}/${questions.length}`}
      preferences={preferences}
      progress={(currentQuestion + 1) / questions.length * 100}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Problem Statement</h3>
          <p className="text-gray-700">{questions[currentQuestion].problem}</p>
          
          {questions[currentQuestion].examples && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Examples:</h4>
              {questions[currentQuestion].examples.map((example, index) => (
                <div key={index} className="bg-white p-3 rounded border border-gray-200 mb-2">
                  <p className="font-mono text-sm">Input: {example.input}</p>
                  <p className="font-mono text-sm">Output: {example.output}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Solution
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 font-mono text-sm p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write your code here..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next Challenge' : 'Submit'}
          </button>
        </div>
      </div>
    </TestLayout>
  );
}

export default CodingTest;