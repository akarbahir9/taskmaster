export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type FilterType = "all" | "active" | "completed";

// ScriptSpark Types
export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'other';
  archetype: string;
  motivation: string;
  traits: string[];
  characterArc: string;
}

export interface ScriptProject {
  id: string;
  title: string;
  logline: string;
  genres: string[];
  tones: string[];
  synopsis: string;
  characters: Character[];
  script?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScriptGenerationRequest {
  title: string;
  logline: string;
  genres: string[];
  tones: string[];
  synopsis: string;
  characters: Character[];
}

export interface ScriptGenerationResponse {
  script: string;
  success: boolean;
  error?: string;
}

export type Genre = 
  | 'Action'
  | 'Comedy'
  | 'Drama'
  | 'Horror'
  | 'Thriller'
  | 'Sci-Fi'
  | 'Fantasy'
  | 'Romance'
  | 'Mystery'
  | 'Western';

export type Tone = 
  | 'Gritty'
  | 'Lighthearted'
  | 'Suspenseful'
  | 'Hopeful'
  | 'Dark'
  | 'Satirical'
  | 'Whimsical'
  | 'Serious'
  | 'Epic'
  | 'Intimate';

export type CharacterRole = 'protagonist' | 'antagonist' | 'supporting' | 'other';

export interface ScriptFormData {
  title: string;
  logline: string;
  genres: string[];
  tones: string[];
  synopsis: string;
  characters: Character[];
}
