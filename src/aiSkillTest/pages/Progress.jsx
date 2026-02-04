import { Award, Clock, Target, TrendingUp } from 'lucide-react';

function Progress() {
  const assessments = [
    {
      date: '2024-01-15',
      score: 82,
      improvement: '+5%',
      areas: ['Machine Learning', 'Deep Learning'],
    },
    {
      date: '2023-12-01',
      score: 77,
      improvement: '+3%',
      areas: ['Neural Networks', 'Computer Vision'],
    },
    {
      date: '2023-11-15',
      score: 74,
      improvement: '+7%',
      areas: ['Data Processing', 'Model Evaluation'],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">Learning Progress</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold">Overall Progress</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">82%</p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold">Certificates</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">3</p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold">Hours Spent</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">45</p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold">Skills Mastered</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-600">12</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-4">Assessment History</h3>
          {assessments.map((assessment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500 mb-1">{assessment.date}</div>
                  <div className="font-semibold mb-2">Score: {assessment.score}%</div>
                  <div className="text-sm text-green-600">Improvement: {assessment.improvement}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Areas Covered:</div>
                  <div className="space-x-2">
                    {assessment.areas.map((area, areaIndex) => (
                      <span
                        key={areaIndex}
                        className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Progress;