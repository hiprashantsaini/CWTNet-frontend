import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

function TestLayout({ title, preferences, progress, children }) {
  const [timeLeft, setTimeLeft] = useState(preferences.testDuration * 60); // Convert minutes to seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsTimerActive(false);
          clearInterval(timer);
          // Trigger test submission when time runs out
          if (preferences.onTimeUp) {
            preferences.onTimeUp();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, preferences]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Level: {preferences.knowledgeLevel} | Type: {preferences.testType}
              </p>
              <p className="text-sm text-gray-500">Topic: {preferences.skillInterest}</p>
            </div>
            <div className="flex items-center space-x-2 text-indigo-600">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-2 bg-indigo-600 rounded transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

export default TestLayout;