
import React from 'react';
import { QuadrantID, Task } from '../types';
import TaskCard from './TaskCard';

interface QuadrantColumnProps {
  quadrantId: QuadrantID;
  title: string;
  subtitle: string;
  tasks: Task[];
  deleteTask: (taskId: string, quadrant: QuadrantID) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, quadrantId: QuadrantID) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, quadrantId: QuadrantID) => void;
  draggedItemId: string | null;
  sourceQuadrantId: QuadrantID | null;
  details: {
    textColor: string;
    borderColor: string;
    bgColor: string;
  };
}

const QuadrantColumn: React.FC<QuadrantColumnProps> = ({
  quadrantId,
  title,
  subtitle,
  tasks,
  deleteTask,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedItemId,
  sourceQuadrantId,
  details,
}) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItemId && sourceQuadrantId) {
      setIsOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      onDrop(e, quadrantId);
      setIsOver(false);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl shadow-sm border ${details.borderColor} ${details.bgColor} p-4 transition-all duration-300 ${isOver ? 'bg-opacity-20 scale-[1.02] shadow-lg' : ''}`}
    >
      <div className="mb-4">
        <h2 className={`text-lg font-bold ${details.textColor}`}>{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <div className="space-y-3 min-h-[150px]">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              quadrantId={quadrantId}
              onDelete={deleteTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedItemId === task.id}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {isOver ? "Aufgabe hier ablegen" : "Keine Aufgaben"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuadrantColumn;
