import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTest } from '../../context/TestContext';
import CaseStudyTest from '../components/test-interfaces/CaseStudyTest';
import CodingTest from '../components/test-interfaces/CodingTest';
import MCQTest from '../components/test-interfaces/MCQTest';
import PracticalTest from '../components/test-interfaces/PracticalTest';

function TestInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, loading, error, isEvaluating, startTest, submitTest } = useTest();
  
  const preferences = location.state?.preferences || {
    knowledgeLevel: 'Beginner',
    testType: 'Multiple Choice Questions',
    testDuration: '30',
    skillInterest: 'General AI'
  };

  useEffect(() => {
    if (!questions || questions.length === 0) {
      startTest(preferences);
    }
  }, [preferences, questions]);

  const handleTestComplete = async () => {
    const results = await submitTest();
    if (results) {
      navigate('/aiskill/results', { state: { results } });
    }
  };

  const handleTimeUp = async () => {
   
    handleTestComplete();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {isEvaluating ? 'Evaluating your answers...' : 'Generating your personalized test...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => startTest(preferences)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const testProps = {
    preferences: {
      ...preferences,
      onTimeUp: handleTimeUp
    },
    questions,
    onComplete: handleTestComplete
  };

  const renderTestInterface = () => {
    switch (preferences.testType) {
      case 'Multiple Choice Questions':
        return <MCQTest {...testProps} />;
      case 'Coding Challenge':
        return <CodingTest {...testProps} />;
      case 'Case Study':
        return <CaseStudyTest {...testProps} />;
      case 'Practical Implementation':
        return <PracticalTest {...testProps} />;
      default:
        return <MCQTest {...testProps} />;
    }
  };

  return questions.length > 0 ? renderTestInterface() : null;
}

export default TestInterface;