export type GameZone = 'outdoor' | 'lobby' | 'elevator' | 'office';

export type ViewMode = 'first' | 'third';

export interface EmployeeProfile {
  name: string;
  nip: string;
  role: string;
  squad: string;
  division: string;
  avatarSeed: string;
  checkedIn: boolean;
  checkInTime: string | null;
  tasksCompleted: number;
  energy: number; // 0 - 100
}

export interface FloorInfo {
  floor: number; // 0 for Ground (G), 1 - 32
  label: string;
  name: string;
  division: string;
  color: string;
  description: string;
  hasSpecialDecor?: boolean;
}

export interface InteractableObject {
  id: string;
  type:
    | 'security'
    | 'reception'
    | 'face_recog'
    | 'elevator_door_outside'
    | 'elevator_panel'
    | 'workstation'
    | 'meeting_board'
    | 'coffee_machine'
    | 'water_dispenser'
    | 'locker'
    | 'sink_male'
    | 'sink_female'
    | 'colleague'
    | 'sky_window'
    | 'outdoor_entrance';
  title: string;
  prompt: string;
  position: [number, number, number];
  radius: number;
  data?: Record<string, unknown>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
}
