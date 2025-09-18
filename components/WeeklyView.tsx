
import React from 'react';
import { QuadrantID, Tasks } from '../types';
import { QUADRANTS } from '../constants';
import TaskCard from './TaskCard';

interface WeeklyViewProps {
  tasks: Tasks;
  deleteTask: (taskId: string, quadrant: QuadrantID) => void;
  moveTask: (taskId: string, sourceQuadrant: QuadrantID, destQuadrant: QuadrantID, destinationIndex: number) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ tasks, deleteTask }) => {
  const weeklyTasks = tasks[QuadrantID.Schedule];
  const details = QUADRANTS[QuadrantID.Schedule];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceQuadrantId', QuadrantID.Schedule);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
           <div className={`w-3 h-3 rounded-full ${details.color}`}></div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{details.title}</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Dies sind Ihre strategischen Aufgaben. Planen Sie Zeit in Ihrem Kalender, um sich auf diese wichtigen Ziele zu konzentrieren.
        </p>
        <div className="space-y-3">
          {weeklyTasks.length > 0 ? (
            weeklyTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                quadrantId={QuadrantID.Schedule}
                onDelete={deleteTask}
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={() => {}}
                isDragging={false} // Dragging from here is not fully supported, but allows interaction
              />
            ))
          ) : (
            <div className="text-center py-10 px-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">Keine geplanten Aufgaben</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fügen Sie Aufgaben zur "Planen"-Matrix hinzu, um sie hier zu sehen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
