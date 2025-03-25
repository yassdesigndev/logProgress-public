import React, { useState, useEffect } from 'react';
import { Activity } from './types';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { Dashboard } from './components/Dashboard';
import { loadFromLocalStorage, addActivity, deleteActivity } from './utils/storage';
import { BarChart3, ListTodo, Sun, Moon } from 'lucide-react';

/*
 * logProgress - Track Finances, Health, and Daily Habits
 * Copyright (C) 2024 logProgress
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [view, setView] = useState<'list' | 'dashboard'>('list');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const data = loadFromLocalStorage();
    setActivities(data.activities);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddActivity = (activity: Activity) => {
    addActivity(activity);
    setActivities([...activities, activity]);
  };

  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const handleDeleteActivityByName = (name: string) => {
    const activitiesToDelete = activities.filter(activity => activity.name === name);
    activitiesToDelete.forEach(activity => deleteActivity(activity.id));
    setActivities(activities.filter(activity => activity.name !== name));
  };

  return (
    <div className={`min-h-full w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8 overflow-y-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              logProgress
            </h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Track your finances, health, and daily habits
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ActivityForm onSubmit={handleAddActivity} activities={activities} darkMode={darkMode} />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    view === 'list'
                      ? 'bg-blue-500 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ListTodo size={20} />
                  List View
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    view === 'dashboard'
                      ? 'bg-blue-500 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 size={20} />
                  Dashboard
                </button>
              </div>
            </div>

            {view === 'list' ? (
              <ActivityList
                activities={activities}
                onDelete={handleDeleteActivity}
                darkMode={darkMode}
              />
            ) : (
              <Dashboard 
                activities={activities}
                onDelete={handleDeleteActivityByName}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;