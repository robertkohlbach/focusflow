import React, { useState } from 'react';
import { Task, WeeklyPlan, WeeklyPlanColumnID } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import TaskColumn from './QuadrantColumn';
import DayCell from './DayCell';

interface WeeklyCalendarViewProps {
  tasks: Task[]; // All plannable tasks (Do & Schedule)
  weeklyPlan: WeeklyPlan;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, source: WeeklyPlanColumnID, dest: WeeklyPlanColumnID, index: number) => void;
  updateTaskContent: (taskId: string, newContent: string) => void;
  improveTaskContent: (content: string) => Promise<string>;
}

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({ tasks, weeklyPlan, deleteTask, moveTask, updateTaskContent, improveTaskContent }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<WeeklyPlanColumnID | null>(null);

  const taskMap = new Map(tasks.map(task => [task.id, task]));

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: WeeklyPlanColumnID) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', columnId);
    setDraggedItemId(taskId);
    setSourceColumnId(columnId);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setSourceColumnId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, destColumnId: WeeklyPlanColumnID) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceId = e.dataTransfer.getData('sourceColumnId') as WeeklyPlanColumnID;

    if (taskId && sourceId) {
      const destTasks = weeklyPlan[destColumnId];
      moveTask(taskId, sourceId, destColumnId, destTasks.length);
    }
  };

  const getTasksForColumn = (taskIds: string[]): Task[] => {
    return taskIds.map(id => taskMap.get(id)).filter((task): task is Task => !!task);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
      {/* Backlog Sidebar */}
      <div className="w-full lg:w-1/4 lg:max-w-sm flex-shrink-0">
        <TaskColumn
          id="backlog"
          title="Ungeplant"
          subtitle="Aufgaben zum Einplanen"
          tasks={getTasksForColumn(weeklyPlan.backlog)}
          deleteTask={deleteTask}
          updateTaskContent={updateTaskContent}
          improveTaskContent={improveTaskContent}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, 'backlog')}
          draggedItemId={draggedItemId}
          sourceColumnId={sourceColumnId}
          details={{
            textColor: 'text-slate-600 dark:text-slate-400',
            borderColor: 'border-slate-500/50',
            bgColor: 'bg-slate-500/5',
          }}
        />
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 flex-grow w-full lg:w-3/4">
        {DAYS_OF_WEEK.map(day => (
          <DayCell
            key={day.id}
            day={day}
            tasks={getTasksForColumn(weeklyPlan[day.id])}
            deleteTask={deleteTask}
            updateTaskContent={updateTaskContent}
            improveTaskContent={improveTaskContent}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, day.id)}
            draggedItemId={draggedItemId}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendarView;