import { Brain, BarChart as ChartBar, CheckCircle, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTest } from '../../context/TestContext';

function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = useTest();
  const testResults = location.state?.results || results;

  if (!testResults) {
    navigate('/aiskill/assessment');
    return null;
  }

  
  const skillAreas = [...new Set(
    testResults.detailedFeedback
      .filter(feedback => feedback.skillArea)
      .map(feedback => feedback.skillArea)
  )];

  const finalSkillAreas = skillAreas.length > 0 ? skillAreas : ["General Skills"];

  const calculatePercentage = (detailedFeedback) => {
    const totalQuestions = detailedFeedback.length;
    const correctAnswers = detailedFeedback.filter(feedback => feedback.correct).length;
    return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  };

  const percentage = calculatePercentage(testResults.detailedFeedback);

  const handleViewRecommendations = () => {
    navigate('/aiskill/recommendations', { 
      state: { 
        score: percentage,
        feedback: testResults.feedback,
        skillAreas: finalSkillAreas,  
        detailedFeedback: testResults.detailedFeedback
      }
    });
  };
  const handleGetCertificate = () => {
    navigate('/aiskill/certificate', { 
      state: { 
        results: {
          percentage: percentage, // Use recalculated percentage here
          feedback: testResults.feedback,
          skillArea: finalSkillAreas,
          testType: location.state?.preferences?.testType || 'Assessment'
        }
      }
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
      <div className="flex items-center justify-center space-x-2">
        <p className="text-gray-600">Final Score:</p>
        <p className="text-3xl font-bold text-indigo-600">{percentage.toFixed(2)}%</p>
      </div>
      <p className="text-gray-600 mt-2">{testResults.feedback}</p>
    </div>

    <div className="space-y-6 mb-8">
      <h3 className="text-lg font-semibold">Detailed Feedback</h3>
      {testResults.detailedFeedback.map((feedback, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${feedback.correct ? 'bg-green-50' : 'bg-red-50'}`}
        >
          <div className="flex items-start space-x-3">
            {feedback.correct ? (
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 mt-1" />
            )}
            <div>
              <p className={`font-medium ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
                Question {feedback.questionId}
                {feedback.skillArea && (
                  <span className="ml-2 text-sm text-gray-600">({feedback.skillArea})</span>
                )}
              </p>
              <p className="text-gray-600 mt-1">{feedback.explanation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={handleViewRecommendations}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold rounded-lg py-3 px-6 hover:bg-indigo-700 transition-all duration-200"
        >
          <Brain className="h-6 w-6" />
          <span>View Recommendations</span>
        </button>
  
        <button
          onClick={handleGetCertificate}
          className="flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-600 font-semibold rounded-lg py-3 px-6 hover:bg-indigo-50 transition-all duration-200"
        >
          <ChartBar className="h-6 w-6" />
          <span>Get Certificate</span>
        </button>
      </div>
    </div>
  // </div>
  
  );
}

export default Results;
