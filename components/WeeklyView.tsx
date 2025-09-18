import React from 'react';
import { Task, WeeklyPlan, WeeklyPlanColumnID } from '../types';
import WeeklyCalendarView from './WeeklyCalendarView'; // New calendar view component

interface WeeklyViewProps {
  tasks: Task[]; // All plannable tasks (Do & Schedule)
  weeklyPlan: WeeklyPlan;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, source: WeeklyPlanColumnID, dest: WeeklyPlanColumnID, index: number) => void;
  updateTaskContent: (taskId: string, newContent: string) => void;
  improveTaskContent: (content: string) => Promise<string>;
}

const WeeklyView: React.FC<WeeklyViewProps> = (props) => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
         <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Wochenplan</h2>
      </div>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-4xl">
         Planen Sie Ihre Woche, indem Sie Aufgaben aus der Spalte "Ungeplant" in die entsprechenden Tage ziehen. Der farbige Punkt zeigt die ursprüngliche Priorität aus der Eisenhower-Matrix an.
      </p>
      
      <WeeklyCalendarView {...props} />

    </div>
  );
};

export default WeeklyView;