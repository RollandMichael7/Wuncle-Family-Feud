export enum PrismSide {
  Front,
  Right,
  Back,
  Left,
  Top,
  Bottom,
}

export interface Game {
  buzzed: [];
  final_round: FinalRoundQuestion[];
  final_round2: FinalRoundQuestion[];
  final_round_timers: number[];
  hide_first_round: boolean;
  show_timer: boolean;
  is_final_round: boolean;
  is_final_second: boolean;
  point_tracker: number[];
  registeredPlayers: [];
  room: string;
  round: number;
  round_start_time: number;
  rounds: RoundQuestion[];
  teams: Team[];
  host: GameHost;
  settings: GameSettings;
  tick: number;
  title: boolean;
  title_text: string;
}

export interface GameSettings {
  theme: string;
  logo_url: string | undefined;
  final_round_title: string | undefined;
  player_buzzer_sound: boolean;
  first_buzzer_sound_only: boolean;
  hide_questions: boolean;
}

export interface RoundQuestion {
  answers: Answer[];
  multiply: number;
  question: string;
}

export interface Answer {
  ans: String;
  pnt: number;
  trig: boolean;
}

export interface FinalRoundQuestion {
  answers: [string, number][];
  input: string;
  points: number;
  question: string;
  revealed: boolean;
  points_revealed: boolean;
  selection: number;
}

export interface Team {
  name: string;
  points: number;
  mistakes: number;
}

export interface GameHost {
  id: string;
}
