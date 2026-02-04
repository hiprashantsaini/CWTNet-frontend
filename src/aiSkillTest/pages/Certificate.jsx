import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Award, Download } from 'lucide-react';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

function Certificate() {
  const location = useLocation();
  const certificateRef = useRef(null);
  const { results } = location.state || {
    results: {
      percentage: 85,
      feedback: "Excellent understanding of concepts",
      skillArea: "AI and Machine Learning",
      testType: "Assessment"
    }
  };

  const downloadCertificate = async () => {
    try {
      const certificate = certificateRef.current;
      const canvas = await html2canvas(certificate, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`CWTNet-${results.skillArea}-Certificate.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div 
        ref={certificateRef}
        className="bg-white shadow-lg rounded-lg p-12 mb-8"
        style={{ 
          backgroundImage: 'linear-gradient(135deg, #f5f7ff 0%, #c3dafe 100%)',
          border: '20px solid #fff'
        }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Award className="h-20 w-20 text-indigo-600" />
          </div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Certificate of Achievement</h1>
            <p className="text-xl text-gray-600">This certifies that</p>
            <p className="text-3xl font-semibold my-6 text-indigo-700">John Doe</p>
            <p className="text-xl text-gray-600">has successfully completed the</p>
            <p className="text-2xl font-bold text-gray-800 my-6">{results.skillArea} {results.testType}</p>
            <p className="text-xl text-gray-600">with an outstanding score of</p>
            <p className="text-4xl font-bold text-indigo-600 my-6">{results.percentage}%</p>
            <p className="text-lg text-gray-700 italic mt-4">"{results.feedback}"</p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm text-gray-600">Date Issued</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <img 
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEZ0lEQVR4nO2ZbUxbZRjH/+e0PS1tT4stLW2BFihQGBuDrUx2oTI3cW5RnJofNPqBxSxq9IM6NZlL1GgWjVk0mZkfTKbGD34wJn4x0TWaYMTNwcYGrAyQAesuK2tLgfZ0lJ6ec54bSFZK3xfa05a4/pP+k+ep5/T3f+7nvu/nvgv8j/8wCIBBAKYBXCOEXHIdd5yXJTI8KpFPz0kSEaV8QnZ2NjIzM6HT6ZCbm4usrCyo1WrwPA9RFDE7O4vp6WkEg0HMzc1hYWEBoihCkiSIoghZlkFISBhFUUCj0YAQAo7jQFEUKIoCwzAwGo3Iz8+HxWJBQUEBLBYLsrOzodFoEA6HEQgE4Pf7MTU1hcnJSYyPj8Pn82F0dBQTExOYn5+HJEmgKAqEEMiyDEmSQNM0WJYFx3FgWRYMw4CmabAsG7svCAJCoRAkSYIoihBFEeFwGKFQCHNzc5ifn0cwGEQwGEQoFEI4HIYsy6AoChRFgaZp0DQNjuOQlpaG9PR0pKWlIT09HRkZGTAajTAYDDAYDNDr9dBqtVCr1eA4DizLgmVZsCwbm5+iKFAUBUJI7F6CvQG4BuBbQsjFRO+JoghJkhAOhxEKhSBJUoRGoxE0Gg0EQYAgCNBoNLGJOY4Dz/NgWTYmRJZlSJIUo8AwDARBiP2u0+mg0+mg1Wqh0+mg1+sTEVwD8DWAbwD8kWgPbwYh5CyA0wBe2+yYzQQh5CyATwF8BODPzR7vZoAQ8gWATwAcAfDXZo+bDELIlwA+BnAYwPXNHj8RCCFfAfgIwEEA45s9D5BkGxFCvgZwHMB7AIY3ey5g/W3ECTyvzAF3IhG/AzgB4F0AA5s9J7DxbcQDeGGd49+RRFwBcBLAOwD6N3teYP3b6Fl3eRkH8DaAQwD6NntugMI6ByQPSYQPwHEAbwHo2ey5AQoU1f8cAFzRhTlGxBiAowAOAujc7LlpANBzWjzd3QnGYAC0WkCrhVqtBsMwoGkaFEWB4ziQOEVRkGUZkUgEkUgEsixDlmUQQiDLMkRRRDgchiRJEEURoVAIoigikXtJCBkHcArAmwA6NnvuGGgAYBgGOp0OWq0WgiCAZVlwHAeGYcAwDGiaXrEwRVGgKAoURYFhmNi9+PsURYGm6RXviaIISZJiYiKRCERRRCQSQSQSQTgcRigUQigUWlXcEkImAHwI4A0A7Zs9NwCApijwPA+9Xg+DwQCj0Qiz2Yy0tDQYDAZotVrwPA+O48DzPHieB8/z4DgOHMeB4zgwDBMTwTAMaJqOzR0VGY1IVGAkEkE4HEYoFMLi4iIWFxexsLCAhYUFLC0tYWlxEUtLS1haWsLS0hKWl5cRiUQgy3JU3DSADwC8DqBts+cGAJTZbJbz8vJIYWEhKSoqIsXFxaSkpISUlpaS0tJSUlZWRsrLy0lFRQWprKwkVVVVpLq6mtTU1JDa2lpSV1dH6uvrSUNDA2lsbCSNjY2kqamJNDc3k5aWFtLa2kra2tqIy+UiLS0txOl0EqfTSZxOJ3E4HKS4uJgUFRWRwsJCkp+fT3Jzc4nZbCYmk4kYjUai1+uJTqcjgiAQnudXXBzHEYZhCE3ThKIoQlEUSXYxAP4G8qDw5TmvmYsAAAAASUVORK5CYII="
                  alt="Signature"
                  className="h-12"
                />
                <div className="w-48 border-t border-gray-400 mt-2">
                  <p className="text-sm text-gray-600">Authorized Signature</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="font-semibold">#ASTRA-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={downloadCertificate}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Download Certificate</span>
        </button>
        {/* <button className="flex items-center space-x-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
          <Share2 className="h-5 w-5" />
          <span>Share Certificate</span>
        </button> */}
      </div>
    </div>
  );
}

export default Certificate;