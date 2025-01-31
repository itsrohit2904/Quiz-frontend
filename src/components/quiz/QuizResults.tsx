import React, { useState, useEffect } from 'react';
import { EyeIcon, Trash2 } from 'lucide-react';
import { QuizResult } from '../../types/quiz';

export const QuizResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedQuizResults, setSelectedQuizResults] = useState<QuizResult[] | null>(null);

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

  const viewQuizParticipants = (quizId: string, quizTitle: string) => {
    const quizParticipants = results.filter(result => result.quizId === quizId);
    setSelectedQuizResults(quizParticipants);
  };

  const closeParticipantView = () => {
    setSelectedQuizResults(null);
  };

  const uniqueQuizzes = Array.from(new Set(results.map(result => result.quizId)))
    .map(quizId => {
      const firstResult = results.find(result => result.quizId === quizId);
      return {
        id: quizId,
        title: firstResult?.quizTitle || 'Untitled Quiz',
        totalParticipants: results.filter(result => result.quizId === quizId).length,
        averageScore: Math.round(
          results
            .filter(result => result.quizId === quizId)
            .reduce((sum, result) => sum + result.score, 0) / 
          results.filter(result => result.quizId === quizId).length
        )
      };
    });

  if (selectedQuizResults) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{selectedQuizResults[0].quizTitle} - Participants</h2>
          <button 
            onClick={closeParticipantView}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Results
          </button>
        </div>
        <div className="space-y-4">
          {selectedQuizResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{result.participantName}</p>
                <p className="text-gray-600">{result.participantEmail}</p>
                <p className={`font-bold ${
                  result.score >= 90 ? 'text-green-600' : 
                  result.score >= 70 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  Score: {result.score}%
                </p>
                <p className="text-sm text-gray-500">
                  Taken on: {new Date(result.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Quiz Results</h2>
      
      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No quiz results yet.
        </div>
      ) : (
        <div className="space-y-4">
          {uniqueQuizzes.map((quiz) => (
            <div key={quiz.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 
                  className="text-lg font-semibold cursor-pointer hover:text-blue-600" 
                  onClick={() => viewQuizParticipants(quiz.id, quiz.title)}
                >
                  {quiz.title}
                </h3>
                <div className="text-sm text-gray-600">
                  <p>Total Participants: {quiz.totalParticipants}</p>
                  <p>Average Score: {quiz.averageScore}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => viewQuizParticipants(quiz.id, quiz.title)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <EyeIcon size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};