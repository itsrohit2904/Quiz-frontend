import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Option, Question, Quiz } from '../../types/quiz'; 
export const QuizGenerator: React.FC = () => {
  const navigate = useNavigate();
  const {quizId} = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{
    id: 1,
    type: 'multiple-choice',
    questionText: '',
    options: [
      { id: 1, text: '' },
      { id: 2, text: '' },
      { id: 3, text: '' },
      { id: 4, text: '' }
    ],
    correctAnswer: ''
  }]);
  useEffect(() => {
    if (quizId) {
      const existingQuizzes = JSON.parse(sessionStorage.getItem('quizzes') || '[]');
      const quizToEdit = existingQuizzes.find((q: Quiz) => q.id === quizId);
      
      if (quizToEdit) {
        setTitle(quizToEdit.title);
        setDescription(quizToEdit.description);
        setQuestions(quizToEdit.questions);
      }
    }
  }, [quizId]);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: questions.length + 1,
      type: 'multiple-choice',
      questionText: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
        { id: 4, text: '' }
      ],
      correctAnswer: ''
    }]);
  };

  const handleQuestionTypeChange = (questionId: number, newType: Question['type']) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        let options: Option[] = [];  // Now Option type should be recognized
        
        switch (newType) {
          case 'multiple-choice':
            options = [
              { id: 1, text: '' },
              { id: 2, text: '' },
              { id: 3, text: '' },
              { id: 4, text: '' }
            ];
            break;
          case 'true-false':
            options = [
              { id: 1, text: 'True' },
              { id: 2, text: 'False' }
            ];
            break;
          case 'short-answer':
            options = [];
            break;
        }

        return {
          ...question,
          type: newType,
          options,
          correctAnswer: ''
        };
      }
      return question;
    }));
  };

  const handleQuestionTextChange = (questionId: number, text: string) => {
    setQuestions(questions.map(question => 
      question.id === questionId ? { ...question, questionText: text } : question
    ));
  };

  const handleOptionChange = (questionId: number, optionId: number, text: string) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.map(option => 
            option.id === optionId ? { ...option, text } : option
          )
        };
      }
      return question;
    }));
  };

  const handleCorrectAnswerChange = (questionId: number, answer: string) => {
    setQuestions(questions.map(question =>
      question.id === questionId ? { ...question, correctAnswer: answer } : question
    ));
  };

  const deleteQuestion = (questionId: number) => {
    setQuestions(questions.filter(question => question.id !== questionId));
  };

  const handleGenerateQuiz = () => {
    // Validate quiz data
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (questions.some(q => !q.questionText.trim())) {
      alert('Please fill in all question texts');
      return;
    }

    if (questions.some(q => q.type !== 'short-answer' && !q.correctAnswer)) {
      alert('Please select correct answers for all questions');
      return;
    }

    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      questions,
      createdAt: new Date(),
      participants: 0,
      averageScore: 0
    };

    // Save quiz to sessionStorage
    const existingQuizzes = JSON.parse(sessionStorage.getItem('quizzes') || '[]');
    sessionStorage.setItem('quizzes', JSON.stringify([...existingQuizzes, newQuiz]));

    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Quiz Details</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            placeholder="Quiz Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-4">
                <h4 className="font-medium">Question {index + 1}</h4>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <select
                className="border rounded p-1"
                value={question.type}
                onChange={(e) => handleQuestionTypeChange(question.id, e.target.value as Question['type'])}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </div>
            
            <input
              type="text"
              placeholder="Enter your question"
              value={question.questionText}
              onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {question.type !== 'short-answer' && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div key={option.id} className="flex gap-2">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                      placeholder={`Option ${option.id}`}
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      readOnly={question.type === 'true-false'}
                    />
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === option.text}
                      onChange={() => handleCorrectAnswerChange(question.id, option.text)}
                      className="mt-3"
                    />
                  </div>
                ))}
              </div>
            )}

            {question.type === 'short-answer' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter correct answer"
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(question.id, e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={addQuestion}
          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Question
        </button>
        <button 
          onClick={handleGenerateQuiz}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
};