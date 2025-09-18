
import React, { useState } from 'react';
import { QuadrantID, Tasks } from '../types';
import { QUADRANTS } from '../constants';
import AddTaskForm from './AddTaskForm';
import QuadrantColumn from './QuadrantColumn';

interface EisenhowerMatrixProps {
  tasks: Tasks;
  addTask: (content: string, quadrant: QuadrantID) => void;
  deleteTask: (taskId: string, quadrant: QuadrantID) => void;
  moveTask: (taskId: string, sourceQuadrant: QuadrantID, destQuadrant: QuadrantID, destinationIndex: number) => void;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, addTask, deleteTask, moveTask }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [sourceQuadrantId, setSourceQuadrantId] = useState<QuadrantID | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, quadrantId: QuadrantID) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceQuadrantId', quadrantId);
    setDraggedItemId(taskId);
    setSourceQuadrantId(quadrantId);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setSourceQuadrantId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, destQuadrantId: QuadrantID) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceId = e.dataTransfer.getData('sourceQuadrantId') as QuadrantID;

    if (taskId && sourceId) {
       // A simple implementation for index, could be improved to find exact position
      const destTasks = tasks[destQuadrantId];
      moveTask(taskId, sourceId, destQuadrantId, destTasks.length);
    }
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <AddTaskForm addTask={(content) => addTask(content, QuadrantID.Do)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Object.entries(QUADRANTS).map(([id, quadrant]) => (
          <QuadrantColumn
            key={id}
            quadrantId={id as QuadrantID}
            title={quadrant.title}
            subtitle={quadrant.subtitle}
            tasks={tasks[id as QuadrantID]}
            deleteTask={deleteTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggedItemId={draggedItemId}
            sourceQuadrantId={sourceQuadrantId}
            details={quadrant}
          />
        ))}
      </div>
    </div>
  );
};

export default EisenhowerMatrix;
