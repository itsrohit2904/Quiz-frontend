import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, QuizResult } from '../../types/quiz';

interface ParticipantInfo {
  participantName: string;
  participantEmail: string;
}

export const TakeQuiz: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo>({
    participantName: '',
    participantEmail: ''
  });

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const foundQuiz = savedQuizzes.find((q: Quiz) => q.id === quizId);
    
    if (foundQuiz) {
      // Check if retakes are allowed
      const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      const hasAttempted = quizResults.some((result: QuizResult) => 
        result.quizId === quizId && 
        result.participantEmail === participantInfo.participantEmail
      );

      if (hasAttempted && !foundQuiz.settings?.allowRetake) {
        alert("You have already taken this quiz and retakes are not allowed.");
        navigate('/');
        return;
      }

      setQuiz(foundQuiz);
      
      // Set timer if there's a time limit
      if (foundQuiz.settings?.timeLimit) {
        setTimeRemaining(foundQuiz.settings.timeLimit * 60); // Convert minutes to seconds
      }
    }
  }, [quizId, navigate, participantInfo.participantEmail]);

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (timeRemaining !== null && timeRemaining > 0 && !submitted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining, submitted]);

  const handleParticipantInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipantInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
      if (userAnswer === question.correctAnswer) {
        calculatedScore++;
        correctCount++;
      }
    });

    const finalScore = Math.round((calculatedScore / quiz.questions.length) * 100);
    setScore(finalScore);
    setCorrectAnswers(correctCount);
    setSubmitted(true);

    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const newResult: QuizResult = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      participantName: participantInfo.participantName,
      participantEmail: participantInfo.participantEmail,
      score: finalScore,
      date: new Date().toISOString()
    };
    localStorage.setItem('quizResults', JSON.stringify([...results, newResult]));

    const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const updatedQuizzes = savedQuizzes.map((q: Quiz) => {
      if (q.id === quizId) {
        const currentParticipants = q.participants || 0;
        const currentAverage = q.averageScore || 0;
        return {
          ...q,
          participants: currentParticipants + 1,
          averageScore: Math.round(
            ((currentAverage * currentParticipants) + finalScore) / (currentParticipants + 1)
          )
        };
      }
      return q;
    });
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!quiz) return <div>Loading...</div>;

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-green-600">Quiz Completed!</h2>
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="mb-4 text-left">
            <h3 className="font-semibold mb-2">Participant Information</h3>
            <p>Name: {participantInfo.participantName}</p>
            <p>Email: {participantInfo.participantEmail}</p>
          </div>
          <p className="text-2xl mb-4">Your Score: <span className="font-bold">{score}%</span></p>
          <p className="text-xl text-gray-700 mb-4">
            {correctAnswers} out of {quiz.questions.length} questions correct
          </p>
        </div>
        {quiz.settings?.allowRetake && (
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retake Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">{quiz.title}</h2>
      <p className="mb-6 text-gray-600">{quiz.description}</p>

      {timeRemaining !== null && (
        <div className="mb-4 text-right">
          <span className={`text-lg font-semibold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
            Time Remaining: {formatTime(timeRemaining)}
          </span>
        </div>
      )}

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">Participant Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="participantName"
              value={participantInfo.participantName}
              onChange={handleParticipantInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="participantEmail"
              value={participantInfo.participantEmail}
              onChange={handleParticipantInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

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
          disabled={!participantInfo.participantName || !participantInfo.participantEmail || 
                   Object.keys(userAnswers).length !== quiz.questions.length}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};