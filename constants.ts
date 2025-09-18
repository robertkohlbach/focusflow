
import { QuadrantID, DayID } from './types';

interface QuadrantDetails {
  title: string;
  subtitle: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

export const QUADRANTS: Record<QuadrantID, QuadrantDetails> = {
  [QuadrantID.Do]: {
    title: 'Wichtig & Dringend',
    subtitle: 'Sofort erledigen',
    color: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500/50',
    bgColor: 'bg-red-500/5',
  },
  [QuadrantID.Schedule]: {
    title: 'Wichtig & Nicht Dringend',
    subtitle: 'Planen & Terminieren',
    color: 'bg-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/50',
    bgColor: 'bg-blue-500/5',
  },
  [QuadrantID.Delegate]: {
    title: 'Nicht Wichtig & Dringend',
    subtitle: 'Delegieren',
    color: 'bg-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500/50',
    bgColor: 'bg-orange-500/5',
  },
  [QuadrantID.Eliminate]: {
    title: 'Nicht Wichtig & Nicht Dringend',
    subtitle: 'Verwerfen',
    color: 'bg-slate-500',
    textColor: 'text-slate-600 dark:text-slate-400',
    borderColor: 'border-slate-500/50',
    bgColor: 'bg-slate-500/5',
  },
};

// New constant for Weekly View
// FIX: Export the DayDetails interface so it can be used in other files.
export interface DayDetails {
  id: DayID;
  title: string;
  abbreviation: string;
}

export const DAYS_OF_WEEK: DayDetails[] = [
  { id: 'monday', title: 'Montag', abbreviation: 'Mo' },
  { id: 'tuesday', title: 'Dienstag', abbreviation: 'Di' },
  { id: 'wednesday', title: 'Mittwoch', abbreviation: 'Mi' },
  { id: 'thursday', title: 'Donnerstag', abbreviation: 'Do' },
  { id: 'friday', title: 'Freitag', abbreviation: 'Fr' },
  { id: 'saturday', title: 'Samstag', abbreviation: 'Sa' },
  { id: 'sunday', title: 'Sonntag', abbreviation: 'So' },
];