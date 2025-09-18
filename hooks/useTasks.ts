
import { useState, useEffect, useCallback } from 'react';
import { Tasks, Task, QuadrantID } from '../types';

const INITIAL_TASKS: Tasks = {
  [QuadrantID.Do]: [
    { id: 'task-1', content: 'Projekt-Deadline einhalten' },
    { id: 'task-2', content: 'Dringende Kundenanfrage beantworten' },
  ],
  [QuadrantID.Schedule]: [
    { id: 'task-3', content: 'Q4 Strategie planen' },
    { id: 'task-4', content: 'Wöchentliches Team-Meeting vorbereiten' },
    { id: 'task-5', content: 'Neues Feature konzipieren' },
  ],
  [QuadrantID.Delegate]: [
    { id: 'task-6', content: 'Reisekostenabrechnung einreichen' },
  ],
  [QuadrantID.Eliminate]: [
    { id: 'task-7', content: 'Unnötige E-Mails sortieren' },
  ],
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Tasks>(() => {
    try {
      const storedTasks = window.localStorage.getItem('focusflow-tasks');
      return storedTasks ? JSON.parse(storedTasks) : INITIAL_TASKS;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return INITIAL_TASKS;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [tasks]);

  const addTask = useCallback((content: string, quadrant: QuadrantID = QuadrantID.Do) => {
    if (!content.trim()) return;
    const newTask: Task = { id: `task-${Date.now()}`, content };
    setTasks(prevTasks => ({
      ...prevTasks,
      [quadrant]: [newTask, ...prevTasks[quadrant]],
    }));
  }, []);

  const deleteTask = useCallback((taskId: string, quadrant: QuadrantID) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [quadrant]: prevTasks[quadrant].filter(task => task.id !== taskId),
    }));
  }, []);
  
  const moveTask = useCallback((taskId: string, sourceQuadrant: QuadrantID, destQuadrant: QuadrantID, destinationIndex: number) => {
    setTasks(prevTasks => {
      const sourceTasks = [...prevTasks[sourceQuadrant]];
      const destTasks = sourceQuadrant === destQuadrant ? sourceTasks : [...prevTasks[destQuadrant]];
      
      const taskIndex = sourceTasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      destTasks.splice(destinationIndex, 0, movedTask);

      return {
        ...prevTasks,
        [sourceQuadrant]: sourceTasks,
        [destQuadrant]: destTasks,
      };
    });
  }, []);

  return { tasks, addTask, deleteTask, moveTask };
};
