import { Activity, ActivityLog } from '../types';

const STORAGE_KEY = 'activity_log';

export function loadFromLocalStorage(): ActivityLog {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { activities: [] };
  }
  return JSON.parse(stored);
}

export function saveToLocalStorage(data: ActivityLog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addActivity(activity: Activity) {
  const data = loadFromLocalStorage();
  data.activities.push(activity);
  saveToLocalStorage(data);
}

export function deleteActivity(id: string) {
  const data = loadFromLocalStorage();
  data.activities = data.activities.filter(activity => activity.id !== id);
  saveToLocalStorage(data);
}

export function deleteActivityByName(name: string) {
  const data = loadFromLocalStorage();
  data.activities = data.activities.filter(activity => activity.name !== name);
  saveToLocalStorage(data);
}