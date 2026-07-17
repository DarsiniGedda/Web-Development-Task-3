export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  author: string;
  description: string;
}

export interface ApiResponseData {
  url: string;
  status: number;
  timeMs: number;
  headers: Record<string, string>;
  body: any;
}

export type SelectedApi = 'joke' | 'weather' | 'user' | 'dog' | 'crypto';
