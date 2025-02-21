const TASK_TYPES_STORAGE_KEY = 'taskTypes';

export const defaultTypes = [
  { id: 1, name: 'Operational', color: 'bg-blue-100', tasks: true, events: false },
  { id: 2, name: 'Technical', color: 'bg-sky-100', tasks: true, events: false },
  { id: 3, name: 'Strategic', color: 'bg-green-100', tasks: true, events: false },
  { id: 4, name: 'Hiring', color: 'bg-emerald-100', tasks: true, events: false },
  { id: 5, name: 'Financial', color: 'bg-yellow-100', tasks: true, events: false },
  { id: 6, name: 'Meeting', color: 'bg-orange-100', tasks: false, events: true },
  { id: 7, name: 'Online call', color: 'bg-purple-100', tasks: false, events: true },
];

export const getStoredTypes = () => {
  const storedTypes = localStorage.getItem(TASK_TYPES_STORAGE_KEY);
  return storedTypes ? JSON.parse(storedTypes) : defaultTypes;
};

export const saveTypes = (types) => {
  localStorage.setItem(TASK_TYPES_STORAGE_KEY, JSON.stringify(types));
};

