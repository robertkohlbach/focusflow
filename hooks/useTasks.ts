import { useState, useEffect, useCallback } from 'react';
import { Tasks, Task, QuadrantID, WeeklyPlan, WeeklyPlanColumnID } from '../types';
import { GoogleGenAI } from '@google/genai';

// This is a placeholder, and would be initialized with a real API key in a production environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY for Google GenAI is not set. AI features will not work.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });


const INITIAL_TASKS: Tasks = {
  [QuadrantID.Do]: [
    { id: 'task-1', content: 'Projekt-Deadline einhalten', quadrant: QuadrantID.Do },
    { id: 'task-2', content: 'Dringende Kundenanfrage beantworten', quadrant: QuadrantID.Do },
  ],
  [QuadrantID.Schedule]: [
    { id: 'task-3', content: 'Q4 Strategie planen', quadrant: QuadrantID.Schedule },
    { id: 'task-4', content: 'Wöchentliches Team-Meeting vorbereiten', quadrant: QuadrantID.Schedule },
    { id: 'task-5', content: 'Neues Feature konzipieren', quadrant: QuadrantID.Schedule },
  ],
  [QuadrantID.Delegate]: [
    { id: 'task-6', content: 'Reisekostenabrechnung einreichen', quadrant: QuadrantID.Delegate },
  ],
  [QuadrantID.Eliminate]: [
    { id: 'task-7', content: 'Unnötige E-Mails sortieren', quadrant: QuadrantID.Eliminate },
  ],
};

const INITIAL_WEEKLY_PLAN: WeeklyPlan = {
  backlog: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
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

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => {
    try {
      const storedPlan = window.localStorage.getItem('focusflow-weekly-plan');
      return storedPlan ? JSON.parse(storedPlan) : INITIAL_WEEKLY_PLAN;
    } catch (error) {
      console.error('Error reading weekly plan from localStorage', error);
      return INITIAL_WEEKLY_PLAN;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [tasks]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem('focusflow-weekly-plan', JSON.stringify(weeklyPlan));
    } catch (error) {
      console.error('Error writing weekly plan to localStorage', error);
    }
  }, [weeklyPlan]);

  // Effect to synchronize plannable tasks (Do & Schedule) with weeklyPlan
  useEffect(() => {
    const plannableTasks = [...tasks.do, ...tasks.schedule];
    const plannableTaskIds = new Set(plannableTasks.map(t => t.id));
    const weeklyPlanTaskIds = new Set(Object.values(weeklyPlan).flat());

    const newTasks = plannableTasks.filter(t => !weeklyPlanTaskIds.has(t.id));
    const removedTaskIds = Array.from(weeklyPlanTaskIds).filter(id => !plannableTaskIds.has(id));
    
    // Initialize backlog if empty
    if (plannableTasks.length > 0 && weeklyPlanTaskIds.size === 0 && newTasks.length === plannableTasks.length) {
       setWeeklyPlan(currentPlan => ({ ...currentPlan, backlog: plannableTasks.map(t => t.id)}));
       return;
    }

    if (newTasks.length > 0 || removedTaskIds.length > 0) {
      setWeeklyPlan(currentPlan => {
        const newPlan = JSON.parse(JSON.stringify(currentPlan));

        // Add new tasks to backlog
        newPlan.backlog = [...newPlan.backlog, ...newTasks.map(t => t.id)];

        // Remove tasks that are no longer plannable from all columns
        for (const key in newPlan) {
          newPlan[key as WeeklyPlanColumnID] = newPlan[key as WeeklyPlanColumnID].filter((id: string) => !removedTaskIds.includes(id));
        }
        return newPlan;
      });
    }
  }, [tasks.do, tasks.schedule, weeklyPlan]);

  const addTask = useCallback((content: string, quadrant: QuadrantID = QuadrantID.Do) => {
    if (!content.trim()) return;
    const newTask: Task = { id: `task-${Date.now()}`, content, quadrant };
    setTasks(prevTasks => ({
      ...prevTasks,
      [quadrant]: [newTask, ...prevTasks[quadrant]],
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      for (const quadrantId in newTasks) {
        const key = quadrantId as QuadrantID;
        const originalLength = newTasks[key].length;
        newTasks[key] = newTasks[key].filter(task => task.id !== taskId);
        if (newTasks[key].length < originalLength) {
          // Task was found and removed, no need to continue
          return newTasks;
        }
      }
      // If loop finishes, task was not found (shouldn't happen)
      return prevTasks;
    });
  }, []);
  
  const moveTask = useCallback((taskId: string, sourceQuadrant: QuadrantID, destQuadrant: QuadrantID, destinationIndex: number) => {
    setTasks(prevTasks => {
      const sourceTasks = [...prevTasks[sourceQuadrant]];
      const destTasks = sourceQuadrant === destQuadrant ? sourceTasks : [...prevTasks[destQuadrant]];
      
      const taskIndex = sourceTasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      
      // Update the quadrant property of the moved task
      movedTask.quadrant = destQuadrant;

      destTasks.splice(destinationIndex, 0, movedTask);

      return {
        ...prevTasks,
        [sourceQuadrant]: sourceTasks,
        [destQuadrant]: destTasks,
      };
    });
  }, []);

  const moveWeeklyTask = useCallback((taskId: string, sourceColumn: WeeklyPlanColumnID, destColumn: WeeklyPlanColumnID, destinationIndex: number) => {
    setWeeklyPlan(prevPlan => {
      const sourceTaskIds = [...prevPlan[sourceColumn]];
      const destTaskIds = sourceColumn === destColumn ? sourceTaskIds : [...prevPlan[destColumn]];
      
      const taskIndex = sourceTaskIds.findIndex(id => id === taskId);
      if (taskIndex === -1) return prevPlan;

      const [movedTaskId] = sourceTaskIds.splice(taskIndex, 1);
      destTaskIds.splice(destinationIndex, 0, movedTaskId);

      return {
        ...prevPlan,
        [sourceColumn]: sourceTaskIds,
        [destColumn]: destTaskIds,
      };
    });
  }, []);
  
  const updateTaskContent = useCallback((taskId: string, newContent: string) => {
    setTasks(prevTasks => {
      const newTasks = JSON.parse(JSON.stringify(prevTasks));
      for (const quadrantId in newTasks) {
        const key = quadrantId as QuadrantID;
        const taskIndex = newTasks[key].findIndex((task: Task) => task.id === taskId);
        if (taskIndex !== -1) {
          newTasks[key][taskIndex].content = newContent;
          return newTasks;
        }
      }
      return prevTasks; // Return original if not found
    });
  }, []);

  const improveTaskContent = useCallback(async (content: string): Promise<string> => {
    if (!API_KEY) {
        alert("API Key is not configured. AI features are disabled.");
        return content;
    }
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Verbessere und präzisiere diese Aufgabenbeschreibung. Mache sie klarer und handlungsorientierter. Gib nur den verbesserten Text zurück, ohne zusätzliche Erklärung oder Formatierung.\n\nOriginal: "${content}"`,
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error improving task content:', error);
      alert("Fehler bei der Verbesserung des Textes. Bitte versuchen Sie es erneut.");
      return content;
    }
  }, []);

  return { tasks, addTask, deleteTask, moveTask, weeklyPlan, moveWeeklyTask, updateTaskContent, improveTaskContent };
};