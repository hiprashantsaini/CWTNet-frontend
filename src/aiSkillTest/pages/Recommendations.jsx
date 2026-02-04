import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const genAI = new GoogleGenerativeAI('AIzaSyAmvetEwtejwpUfA_qZBbKJll6A7jRLbN4'); // Replace with actual API key

function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { score = 0, skillAreas = [], feedback = '' } = location.state || {};
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use correct skill areas, not defaulting to "General Skills"
        const activeSkillAreas = skillAreas.length > 0 ? skillAreas : [];

        if (activeSkillAreas.length === 0) {
          setError('No specific skill areas detected.');
          return;
        }

        // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `As a learning advisor, provide personalized learning recommendations.
        
        Student Profile:
        - Assessment Score: ${score}%
        - Skill Areas: ${activeSkillAreas.join(', ')}
        - Overall Feedback: ${feedback}
        
        Provide exactly 3 highly relevant learning resources for each skill area:
        - At least one practical online course (Coursera, Udemy, edX)
        - One professional documentation or tutorial
        - One high-quality video resource
        
        Return ONLY a JSON array:
        [
          {
            "title": "specific course/resource title",
            "url": "actual working URL",
            "source": "platform name",
            "skillArea": "relevant skill area"
          }
        ]`;

        const result = await model.generateContent({ 
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const responseText = await result.response.text();

        let parsedRecommendations;
        try {
          parsedRecommendations = JSON.parse(responseText);
        } catch {
          const jsonMatch = responseText.match(/\[\s*{[\s\S]*}\s*\]/);
          if (!jsonMatch) throw new Error('Invalid response format');
          parsedRecommendations = JSON.parse(jsonMatch[0]);
        }

        if (!Array.isArray(parsedRecommendations) || parsedRecommendations.length === 0) {
          throw new Error('Invalid recommendations format');
        }

        setRecommendations(parsedRecommendations);
      } catch (err) {
        setError('Failed to generate custom recommendations. Showing general suggestions.');
        setRecommendations(skillAreas.flatMap(skill => [
          {
            title: `${skill} - Comprehensive Course`,
            url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
            source: 'Coursera',
            skillArea: skill
          },
          {
            title: `${skill} - Professional Tutorial`,
            url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
            source: 'Udemy',
            skillArea: skill
          },
          {
            title: `${skill} - Documentation`,
            url: `https://www.google.com/search?q=${encodeURIComponent(skill + " tutorial")}`,
            source: 'Various Sources',
            skillArea: skill
          }
        ]));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [score, skillAreas, feedback]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Generating recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-6">Personalized Recommendations</h2>
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
{/* <h3 className="text-lg font-semibold text-indigo-600">{rec.skillArea || "General Skills"}</h3> */}

            <a 
              href={rec.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-2 text-blue-500 hover:underline"
            >
              {rec.title} ({rec.source})
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => navigate('/aiskill/assessment')} 
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Take Another Assessment
        </button>
      </div>
    </div>
  );
}

export default Recommendations;
