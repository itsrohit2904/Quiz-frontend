import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import { Quiz } from '../../types/quiz';

export const QuizPreview: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const savedQuizzes = JSON.parse(sessionStorage.getItem('quizzes') || '[]');
    const currentQuiz = savedQuizzes.find((q: Quiz) => q.id === quizId);
    if (currentQuiz) {
      setQuiz(currentQuiz);
    }
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
          <p className="text-gray-600">{quiz.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Total Questions: {quiz.questions.length}</p>
            <p>Participants: {quiz.participants}</p>
            <p>Average Score: {quiz.averageScore}%</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Edit2 size={16} className="mr-2" />
          Edit Quiz
        </button>
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </h3>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {currentQuestion.type}
          </span>
        </div>

        <p className="text-lg mb-6">{currentQuestion.questionText}</p>

        {currentQuestion.type !== 'short-answer' ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-lg 
                  ${option.text === currentQuestion.correctAnswer 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200'
                  }`}
              >
                {option.text}
                {option.text === currentQuestion.correctAnswer && (
                  <span className="ml-2 text-green-600 text-sm">(Correct Answer)</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="font-medium mb-2">Correct Answer:</p>
            <p>{currentQuestion.correctAnswer}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Question
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};