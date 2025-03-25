import React from 'react';
import { Activity } from '../types';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void;
  darkMode: boolean;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onDelete, darkMode }) => {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Date
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Activity
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Duration/Quantity
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {activities.map((activity) => (
              <tr key={activity.id} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {format(new Date(activity.date), 'MMM d, yyyy')}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {activity.name}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {activity.type === 'duration' ? (
                    `${activity.duration?.hours}h ${activity.duration?.minutes}m`
                  ) : (
                    `${activity.quantity?.value} ${activity.quantity?.unit}`
                  )}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};