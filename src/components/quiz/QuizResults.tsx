import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  date: string;
}

export const QuizResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    setResults(savedResults.sort((a: QuizResult, b: QuizResult) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, []);

  const deleteResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    localStorage.setItem('quizResults', JSON.stringify(updatedResults));
    setResults(updatedResults);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Quiz Results</h3>
      {results.length === 0 ? (
        <p className="text-center text-gray-500">No quiz results yet.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Quiz Title</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Score</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3">{result.quizTitle}</td>
                <td className="py-3">{new Date(result.date).toLocaleDateString()}</td>
                <td className="py-3">{result.score}%</td>
                <td className="py-3">
                  <button 
                    onClick={() => deleteResult(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};