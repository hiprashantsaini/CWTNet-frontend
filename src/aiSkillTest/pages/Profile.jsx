import React from 'react';
import { UserCircle2, Mail, Award, Book } from 'lucide-react';

function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    title: 'AI Engineer',
    certificates: 3,
    completedAssessments: 5,
    skills: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <UserCircle2 className="h-16 w-16 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Award className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Certificates Earned</p>
              <p className="font-medium">{user.certificates}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Book className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Completed Assessments</p>
              <p className="font-medium">{user.completedAssessments}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;