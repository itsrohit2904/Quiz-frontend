import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Quiz } from '../types/quiz';
import { Trash2, Edit2, Eye, Share2 } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuizzes = JSON.parse(sessionStorage.getItem('quizzes') || '[]');
    setQuizzes(savedQuizzes);
  }, []);

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    sessionStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
  };

  const handleEdit = (quizId: string) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleShareQuiz = (quizId: string) => {
    const shareableLink = `${window.location.origin}/take-quiz/${quizId}`;
    
    const fallbackCopyTextToClipboard = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        alert(successful ? 'Quiz link copied to clipboard!' : 'Copy failed');
      } catch (err) {
        alert('Unable to copy link');
      }
      
      document.body.removeChild(textArea);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          alert('Quiz link copied to clipboard!');
        })
        .catch(() => {
          fallbackCopyTextToClipboard(shareableLink);
        });
    } else {
      fallbackCopyTextToClipboard(shareableLink);
    }
  };

  const totalQuizzes = quizzes.length;
  const totalParticipants = quizzes.reduce((sum, quiz) => sum + (quiz.participants || 0), 0);
  const averageScore = quizzes.length > 0
    ? Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.averageScore || 0), 0) / quizzes.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Quizzes</h3>
          <p className="text-3xl font-bold">{totalQuizzes}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Participants</h3>
          <p className="text-3xl font-bold">{totalParticipants}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <p className="text-3xl font-bold">{averageScore}%</p>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Quizzes</h2>
            <Link
              to="/create-quiz"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create New Quiz
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">{quiz.title}</h3>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {quiz.description}
                </p>
                <div className="text-sm text-gray-500 mb-3">
                  <div>Questions: {quiz.questions.length}</div>
                  <div>Participants: {quiz.participants || 0}</div>
                  <div>Average Score: {quiz.averageScore || 0}%</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button 
                    onClick={() => handleEdit(quiz.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleShareQuiz(quiz.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {quizzes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No quizzes created yet. Click "Create New Quiz" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};