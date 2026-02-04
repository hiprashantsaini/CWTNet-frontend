import React, { useState } from 'react';
import TestLayout from './TestLayout';

function CaseStudyTest({ preferences, questions, onComplete }) {
  const [currentCase, setCurrentCase] = useState(0);
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (currentCase < questions.length - 1) {
      setCurrentCase(currentCase + 1);
      setAnswer('');
    } else {
      onComplete();
    }
  };

  return (
    <TestLayout
      title={`Case Study ${currentCase + 1}/${questions.length}`}
      preferences={preferences}
      progress={(currentCase + 1) / questions.length * 100}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">{questions[currentCase].title}</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">{questions[currentCase].background}</p>
            <h4 className="font-medium mb-2">Challenge:</h4>
            <p className="text-gray-700 mb-4">{questions[currentCase].challenge}</p>
            {questions[currentCase].requirements && (
              <>
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {questions[currentCase].requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Analysis and Solution
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write your analysis and proposed solution here..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {currentCase < questions.length - 1 ? 'Next Case Study' : 'Submit'}
          </button>
        </div>
      </div>
    </TestLayout>
  );
}

export default CaseStudyTest;