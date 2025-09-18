
import React, { useState } from 'react';
import Header from './components/Header';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import WeeklyView from './components/WeeklyView';
import { useTasks } from './hooks/useTasks';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Matrix);
  const { tasks, addTask, deleteTask, moveTask } = useTasks();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentView === View.Matrix ? (
          <EisenhowerMatrix
            tasks={tasks}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
          />
        ) : (
          <WeeklyView tasks={tasks} deleteTask={deleteTask} moveTask={moveTask} />
        )}
      </main>
      <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} FocusFlow. Built to bring clarity and focus to your work.</p>
      </footer>
    </div>
  );
};

export default App;
