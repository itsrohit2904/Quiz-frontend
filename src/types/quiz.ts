export interface Option {
    id: number;
    text: string;
  }
  
  export interface Question {
    id: number;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    questionText: string;
    options: Option[];
    correctAnswer: string;
  }
  
  export interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    createdAt: Date;
    participants?: number;
    averageScore?: number;
  }
  