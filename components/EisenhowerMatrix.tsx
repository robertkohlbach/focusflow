import React, { useState } from 'react';
import { QuadrantID, Tasks, WeeklyPlan } from '../types';
import { QUADRANTS } from '../constants';
import AddTaskForm from './AddTaskForm';
import TaskColumn from './QuadrantColumn'; // Using the generalized TaskColumn component from this file

interface EisenhowerMatrixProps {
  tasks: Tasks;
  addTask: (content: string, quadrant: QuadrantID) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, sourceQuadrant: QuadrantID, destQuadrant: QuadrantID, destinationIndex: number) => void;
  weeklyPlan: WeeklyPlan;
  updateTaskContent: (taskId: string, newContent: string) => void;
  improveTaskContent: (content: string) => Promise<string>;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, addTask, deleteTask, moveTask, weeklyPlan, updateTaskContent, improveTaskContent }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [sourceQuadrantId, setSourceQuadrantId] = useState<QuadrantID | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, quadrantId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceQuadrantId', quadrantId);
    setDraggedItemId(taskId);
    setSourceQuadrantId(quadrantId as QuadrantID);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setSourceQuadrantId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, destQuadrantId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceId = e.dataTransfer.getData('sourceQuadrantId') as QuadrantID;

    if (taskId && sourceId) {
       // A simple implementation for index, could be improved to find exact position
      const destTasks = tasks[destQuadrantId as QuadrantID];
      moveTask(taskId, sourceId, destQuadrantId as QuadrantID, destTasks.length);
    }
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <AddTaskForm addTask={(content) => addTask(content, QuadrantID.Do)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Object.entries(QUADRANTS).map(([id, quadrant]) => (
          <TaskColumn
            key={id}
            id={id}
            title={quadrant.title}
            subtitle={quadrant.subtitle}
            tasks={tasks[id as QuadrantID]}
            deleteTask={deleteTask}
            updateTaskContent={updateTaskContent}
            improveTaskContent={improveTaskContent}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggedItemId={draggedItemId}
            sourceColumnId={sourceQuadrantId}
            details={quadrant}
            weeklyPlan={weeklyPlan}
          />
        ))}
      </div>
    </div>
  );
};

export default EisenhowerMatrix;