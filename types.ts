
export enum QuadrantID {
  Do = 'do',
  Schedule = 'schedule',
  Delegate = 'delegate',
  Eliminate = 'eliminate',
}

export interface Task {
  id: string;
  content: string;
}

export type Tasks = {
  [key in QuadrantID]: Task[];
};

export enum View {
  Matrix = 'matrix',
  Weekly = 'weekly',
}
