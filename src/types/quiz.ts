export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  questionText: string;
  options: Option[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  additionalFields?: {
    id: number;
    label: string;
    type: string;
  }[];
  createdAt: Date;
  participants: number;
  averageScore: number;
}