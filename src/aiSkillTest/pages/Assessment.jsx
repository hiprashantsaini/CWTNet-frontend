import { Award, Brain, BarChart as ChartBar, FileCheck, Share2, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Assessment() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    skillInterest: '',
    knowledgeLevel: '',
    testType: '',
    testDuration: '30'
  });

  const testTypes = [
    'Multiple Choice Questions',
    'Coding Challenge',
    'Case Study',
    'Practical Implementation'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/aiskill/test', { state: { preferences: formData } });
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <Brain className="h-10 w-10 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold">Customize Your Assessment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Interest
              </label>
              <input
                type="text"
                name="skillInterest"
                value={formData.skillInterest}
                onChange={handleInputChange}
                placeholder="Enter the skill you want to be assessed on"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Knowledge Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <label
                    key={level}
                    className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${
                      formData.knowledgeLevel === level
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="knowledgeLevel"
                      value={level}
                      checked={formData.knowledgeLevel === level}
                      onChange={handleInputChange}
                      className="sr-only"
                      required
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <select
                name="testType"
                value={formData.testType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select test type</option>
                {testTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Duration (minutes)
              </label>
              <select
                name="testDuration"
                value={formData.testDuration}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Assessment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">AI Skill Assessment</h2>
        <div className="space-y-8 mb-8">
          <div className="flex items-start space-x-4">
            <UserCircle2 className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Personalized Experience</h3>
              <p className="text-gray-600">Our AI-powered assessment adapts to your skill level and learning style.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FileCheck className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Comprehensive Evaluation</h3>
              <p className="text-gray-600">Test your knowledge across multiple AI domains with real-world scenarios.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <ChartBar className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Detailed Analytics</h3>
              <p className="text-gray-600">Get insights into your strengths and areas for improvement.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Award className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Skill Certification</h3>
              <p className="text-gray-600">Earn certificates to showcase your AI expertise.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Share2 className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Share Your Progress</h3>
              <p className="text-gray-600">Connect with peers and share your learning journey.</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition-colors"
        >
          Begin Assessment
        </button>
      </div>
    </div>
  );
}

export default Assessment;