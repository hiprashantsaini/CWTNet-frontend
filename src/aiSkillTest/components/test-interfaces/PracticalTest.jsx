import React, { useState } from 'react';
import TestLayout from './TestLayout';

function PracticalTest({ preferences, questions, onComplete }) {
  const [currentTask, setCurrentTask] = useState(0);
  const [implementation, setImplementation] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = () => {
    if (currentTask < questions.length - 1) {
      setCurrentTask(currentTask + 1);
      setImplementation('');
      setFiles([]);
    } else {
      onComplete();
    }
  };

  return (
    <TestLayout
      title={`Practical Implementation ${currentTask + 1}/${questions.length}`}
      preferences={preferences}
      progress={(currentTask + 1) / questions.length * 100}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">{questions[currentTask].title}</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">{questions[currentTask].description}</p>
            <h4 className="font-medium mb-2">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {questions[currentTask].requirements.map((req, index) => (
                <li key={index} className="text-gray-700">{req}</li>
              ))}
            </ul>
            {questions[currentTask].expectedOutput && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Expected Output:</h4>
                <p className="text-gray-700">{questions[currentTask].expectedOutput}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Implementation Details
            </label>
            <textarea
              value={implementation}
              onChange={(e) => setImplementation(e.target.value)}
              className="w-full h-32 p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your implementation approach..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:border-indigo-500">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span className="mt-2 text-sm text-gray-600">Upload your implementation files</span>
                <input type="file" className="hidden" multiple onChange={handleFileChange} />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                <ul className="mt-1 space-y-1">
                  {Array.from(files).map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {currentTask < questions.length - 1 ? 'Next Task' : 'Submit'}
          </button>
        </div>
      </div>
    </TestLayout>
  );
}

export default PracticalTest;