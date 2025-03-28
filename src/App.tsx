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
    <div className={`min-h-full w-full bg-gradient-to-br ${darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-50 to-indigo-50'}`}>
      <div className="container mx-auto px-4 py-8 overflow-y-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="glass card p-6">
            <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${
              darkMode 
                ? 'from-blue-400 to-indigo-400' 
                : 'from-blue-600 to-indigo-600'
            } inline-block text-transparent bg-clip-text`}>
              logProgress
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track your finances, health, and daily habits
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full glass transition-all duration-300 hover:scale-110 ${
              darkMode 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-gray-700 hover:text-gray-900'
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                    view === 'list'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : darkMode 
                        ? 'glass hover:bg-gray-800 text-gray-200'
                        : 'glass hover:bg-white/90 text-gray-700'
                  }`}
                >
                  <ListTodo size={20} />
                  List View
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                    view === 'dashboard'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : darkMode 
                        ? 'glass hover:bg-gray-800 text-gray-200'
                        : 'glass hover:bg-white/90 text-gray-700'
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

export default App