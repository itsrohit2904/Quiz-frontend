// src/components/quiz/QuizResults.tsx
import React from 'react';

export const QuizResults: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Quiz Results</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Quiz Title</th>
            <th className="text-left py-3">Date</th>
            <th className="text-left py-3">Participants</th>
            <th className="text-left py-3">Avg. Score</th>
            <th className="text-left py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="py-3">JavaScript Basics</td>
            <td className="py-3">2024-01-20</td>
            <td className="py-3">24</td>
            <td className="py-3">78%</td>
            <td className="py-3">
              <button className="text-blue-600 hover:text-blue-800">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};