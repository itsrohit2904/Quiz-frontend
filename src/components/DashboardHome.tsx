import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Quiz } from '../types/quiz';
import { Trash2, Edit2, Eye, Share2, Settings } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');

    const updatedQuizzes = savedQuizzes.map((quiz: Quiz) => ({
      ...quiz,
      settings: quiz.settings || { allowRetake: true, timeLimit: 0, startDate: '', endDate: '' },
      participants: quizResults.filter((result: any) => result.quizId === quiz.id).length,
      averageScore: calculateAverageScore(quiz.id, quizResults),
    }));

    setQuizzes(updatedQuizzes);
  }, []);

  const calculateAverageScore = (quizId: string, results: any[]) => {
    const quizAttempts = results.filter(result => result.quizId === quizId);
    return quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, result) => sum + result.score, 0) / quizAttempts.length)
      : 0;
  };

  const handleSettingsChange = (settings: {
    allowRetake: boolean;
    timeLimit: number;
    startDate: string;
    endDate: string;
  }) => {
    if (!selectedQuiz) return;

    const updatedQuizzes = quizzes.map((quiz) =>
      quiz.id === selectedQuiz.id
        ? { ...quiz, settings }
        : quiz
    );
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
    setShowSettings(false);
    alert('Settings saved successfully!');
  };

  const handleSettingsClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowSettings(true);
  };

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const filteredResults = quizResults.filter((result: any) => result.quizId !== quizId);
    localStorage.setItem('quizResults', JSON.stringify(filteredResults));

    setQuizzes(updatedQuizzes);
  };

  const handleEdit = (quizId: string) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleViewQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };
 

  const handleShareQuiz = (quizId: string) => {
    const shareableLink = `${window.location.origin}/take-quiz/${quizId}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          alert('Quiz link copied to clipboard!');
        })
        .catch(() => {
          alert('Unable to copy link');
        });
    } else {
      alert('Clipboard API not supported');
    }
    
  };

  return (
    <div className="container mx-auto p-6 relative">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-center flex-1">My Quizzes</h1>
    
  </div>
  
  <div className="flex justify-end mb-6">
    <Link 
      to="/create-quiz" 
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
    >
      + Generate Quiz
    </Link>
  </div>

  {quizzes.length === 0 ? (
    <p className="text-gray-500 text-center mt-8 text-lg">No quizzes available. Create a new one!</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz, index) => (
        <div 
          key={quiz.id} 
          className={`relative bg-white border rounded-xl shadow-lg p-6 flex flex-col transition transform hover:scale-105 hover:shadow-2xl ${index === 0 ? 'border-blue-500 ring-2 ring-blue-400' : ''}`}
        >
          {index === 0 && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-full">Newest</span>
          )}
          
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{quiz.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{quiz.description || "No description available"}</p>
          
          <div className="flex justify-between items-center mt-auto border-t pt-4">
            <button onClick={() => handleViewQuiz(quiz.id)} className="p-2 text-blue-500 hover:text-blue-700">
              <Eye size={22} />
            </button>
            <button onClick={() => handleEdit(quiz.id)} className="p-2 text-yellow-500 hover:text-yellow-700">
              <Edit2 size={22} />
            </button>
            <button onClick={() => handleShareQuiz(quiz.id)} className="p-2 text-green-500 hover:text-green-700">
              <Share2 size={22} />
            </button>
            <button onClick={() => handleSettingsClick(quiz)} className="p-2 text-gray-500 hover:text-gray-700">
              <Settings size={22} />
            </button>
            <button onClick={() => deleteQuiz(quiz.id)} className="p-2 text-red-500 hover:text-red-700">
              <Trash2 size={22} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )}

  {showSettings && selectedQuiz && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Quiz Settings</h2>
        <form>
          {/* Allow Retake */}
          <label className="block mb-2">
            Allow Retake:
            <input
              type="checkbox"
              checked={selectedQuiz.settings.allowRetake}
              onChange={(e) =>
                setSelectedQuiz({
                  ...selectedQuiz,
                  settings: {
                    ...selectedQuiz.settings,
                    allowRetake: e.target.checked,
                  },
                })
              }
              className="ml-2"
            />
          </label>

          {/* Time Limit */}
          <label className="block mb-2">
            Time Limit (minutes):
            <input
              type="number"
              value={selectedQuiz.settings.timeLimit}
              onChange={(e) =>
                setSelectedQuiz({
                  ...selectedQuiz,
                  settings: {
                    ...selectedQuiz.settings,
                    timeLimit: Number(e.target.value),
                  },
                })
              }
              className="ml-2 border rounded p-1"
            />
          </label>

          {/* Start Date */}
          <label className="block mb-2">
            Start Date:
            <input
              type="datetime-local"
              value={selectedQuiz.settings.startDate}
              onChange={(e) =>
                setSelectedQuiz({
                  ...selectedQuiz,
                  settings: {
                    ...selectedQuiz.settings,
                    startDate: e.target.value,
                  },
                })
              }
              className="ml-2 border rounded p-1"
            />
          </label>

          {/* End Date */}
          <label className="block mb-4">
            End Date:
            <input
              type="datetime-local"
              value={selectedQuiz.settings.endDate}
              onChange={(e) =>
                setSelectedQuiz({
                  ...selectedQuiz,
                  settings: {
                    ...selectedQuiz.settings,
                    endDate: e.target.value,
                  },
                })
              }
              className="ml-2 border rounded p-1"
            />
          </label>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleSettingsChange(selectedQuiz.settings)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  )    
};
