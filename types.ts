
export enum QuadrantID {
  Do = 'do',
  Schedule = 'schedule',
  Delegate = 'delegate',
  Eliminate = 'eliminate',
}

export interface Task {
  id: string;
  content: string;
  quadrant: QuadrantID;
}

export type Tasks = {
  [key in QuadrantID]: Task[];
};

export enum View {
  Matrix = 'matrix',
  Weekly = 'weekly',
}

// New types for Weekly View
export type DayID = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export const ALL_DAYS: DayID[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export type WeeklyPlanColumnID = DayID | 'backlog';

export type WeeklyPlan = {
  [key in WeeklyPlanColumnID]: string[]; // Store only task IDs
};
