import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Quiz, Question } from '../../types/quiz';

export const TakeQuiz: React.FC = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const foundQuiz = savedQuizzes.find((q: Quiz) => q.id === quizId);
    
    if (foundQuiz) {
      setQuiz(foundQuiz);
    }
  }, [quizId]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let calculatedScore = 0;
    let correctCount = 0;
    quiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          calculatedScore++;
          correctCount++;
        }
      } else if (question.type === 'short-answer') {
        if (userAnswer && userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
          calculatedScore++;
          correctCount++;
        }
      }
    });

    const finalScore = Math.round((calculatedScore / quiz.questions.length) * 100);
    setScore(finalScore);
    setCorrectAnswers(correctCount);
    setSubmitted(true);

    // Update quiz statistics
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const updatedQuizzes = savedQuizzes.map((q: Quiz) => {
      if (q.id === quizId) {
        return {
          ...q,
          participants: (q.participants || 0) + 1,
          averageScore: Math.round(((q.averageScore || 0) + finalScore) / ((q.participants || 0) + 1))
        };
      }
      return q;
    });

    // Save updated quizzes and result
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

    // Save result
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const newResult = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: finalScore,
      date: new Date().toISOString()
    };
    localStorage.setItem('quizResults', JSON.stringify([...results, newResult]));
  };

  if (!quiz) return <div>Loading...</div>;

  if (submitted) {
    const getResultMessage = () => {
      return "Your Quiz has been Submitted"
    };

    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-green-600">Quiz Completed!</h2>
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <p className="text-2xl mb-4">Your Score: <span className="font-bold">{score}%</span></p>
          <p className="text-xl text-gray-700 mb-4">
            {correctAnswers} out of {quiz.questions.length} questions correct
          </p>
          <p className="text-lg font-semibold text-blue-800">
            {getResultMessage()}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">{quiz.title}</h2>
      <p className="mb-6 text-gray-600">{quiz.description}</p>

      {quiz.questions.map((question, index) => (
        <div key={question.id} className="mb-6 border-b pb-6">
          <h3 className="font-semibold mb-4">Question {index + 1}: {question.questionText}</h3>
          
          {question.type === 'multiple-choice' && (
            <div className="space-y-2">
              {question.options.map(option => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${question.id}-${option.id}`}
                    name={`question-${question.id}`}
                    value={option.text}
                    checked={userAnswers[question.id] === option.text}
                    onChange={() => handleAnswerChange(question.id, option.text)}
                    className="mr-2"
                  />
                  <label htmlFor={`q${question.id}-${option.id}`}>{option.text}</label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="space-y-2">
              {question.options.map(option => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${question.id}-${option.id}`}
                    name={`question-${question.id}`}
                    value={option.text}
                    checked={userAnswers[question.id] === option.text}
                    onChange={() => handleAnswerChange(question.id, option.text)}
                    className="mr-2"
                  />
                  <label htmlFor={`q${question.id}-${option.id}`}>{option.text}</label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'short-answer' && (
            <input
              type="text"
              placeholder="Your answer"
              value={userAnswers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
        </div>
      ))}

      <div className="mt-6">
        <button 
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={Object.keys(userAnswers).length !== quiz.questions.length}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};