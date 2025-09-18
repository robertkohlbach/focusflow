import React from 'react';
import { Task, WeeklyPlan, ALL_DAYS, DayID } from '../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  id: string;
  title: string;
  subtitle?: string;
  tasks: Task[];
  deleteTask: (taskId: string) => void;
  updateTaskContent: (taskId: string, newContent: string) => void;
  improveTaskContent: (content: string) => Promise<string>;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  draggedItemId: string | null;
  sourceColumnId: string | null;
  details: {
    textColor: string;
    borderColor: string;
    bgColor: string;
  };
  weeklyPlan?: WeeklyPlan; // Optional weeklyPlan for showing day assignments
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  subtitle,
  tasks,
  deleteTask,
  updateTaskContent,
  improveTaskContent,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedItemId,
  sourceColumnId,
  details,
  weeklyPlan,
}) => {
  const [isOver, setIsOver] = React.useState(false);

  // Create a reverse map to find a task's assigned day
  const taskDayMap = React.useMemo(() => {
    if (!weeklyPlan) return new Map<string, DayID>();
    const map = new Map<string, DayID>();
    for (const day of ALL_DAYS) {
      for (const taskId of weeklyPlan[day]) {
        map.set(taskId, day);
      }
    }
    return map;
  }, [weeklyPlan]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItemId && sourceColumnId) {
      setIsOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      onDrop(e, id);
      setIsOver(false);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl shadow-sm border ${details.borderColor} ${details.bgColor} p-4 transition-all duration-300 flex flex-col ${isOver ? 'bg-opacity-20 scale-[1.02] shadow-lg' : ''}`}
    >
      <div className="mb-4">
        <h2 className={`text-lg font-bold ${details.textColor}`}>{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <div className="space-y-3 min-h-[150px] flex-grow">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={id}
              onDelete={deleteTask}
              onUpdateContent={updateTaskContent}
              improveTaskContent={improveTaskContent}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedItemId === task.id}
              assignedDay={taskDayMap.get(task.id)}
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

export default TaskColumn;