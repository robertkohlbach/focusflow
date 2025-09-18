
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900 ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}
  >
    {label}
  </button>
);


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Focus<span className="text-blue-600">Flow</span>
            </h1>
          </div>
          <nav className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
             <NavButton 
              label="Matrix"
              isActive={currentView === View.Matrix}
              onClick={() => setCurrentView(View.Matrix)}
             />
             <NavButton
              label="Wochenplan"
              isActive={currentView === View.Weekly}
              onClick={() => setCurrentView(View.Weekly)}
             />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
