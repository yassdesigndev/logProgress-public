import React, { useState } from 'react';
import { Activity } from '../types';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';

interface ActivityFormProps {
  onSubmit: (activity: Activity) => void;
  activities: Activity[];
  darkMode: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, activities, darkMode }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activity: Activity = {
      id: Date.now().toString(),
      name,
      date: selectedDate.toISOString(),
      type: 'quantity',
      quantity: { value: parseFloat(quantity) || 1, unit }
    };

    onSubmit(activity);
    setName('');
    setQuantity('1');
    setUnit('');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive numbers
    if (/^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const adjustNumber = (increment: boolean) => {
    const currentValue = parseFloat(quantity) || 0;
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    setQuantity(newValue.toString());
  };

  const handleMonthChange = (increment: boolean) => {
    setSelectedDate(increment ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
  };

  // Get unique activity names
  const uniqueActivities = Array.from(new Set(activities.map(a => a.name)));

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="mb-4">
        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Month
        </label>
        <div className="flex items-center space-x-4 mb-2">
          <button
            type="button"
            onClick={() => handleMonthChange(false)}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {format(selectedDate, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={() => handleMonthChange(true)}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Log item
        </label>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
          Easily track activities like money expenses, groceries, transport, health, mood, self-care, meditation, gym, and more.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
          list="activity-names"
        />
        <datalist id="activity-names">
          {uniqueActivities.map(activity => (
            <option key={activity} value={activity} />
          ))}
        </datalist>
        {uniqueActivities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {uniqueActivities.map(activity => (
              <button
                key={activity}
                type="button"
                onClick={() => setName(activity)}
                className={`px-3 py-1 text-sm rounded-full ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Quantity
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <div className="flex flex-col ml-2">
              <button
                type="button"
                onClick={() => adjustNumber(true)}
                className={`text-gray-500 hover:text-blue-500 ${darkMode ? 'text-gray-400' : ''}`}
              >
                <ChevronRight size={20} />
              </button>
              <button
                type="button"
                onClick={() => adjustNumber(false)}
                className={`text-gray-500 hover:text-blue-500 ${darkMode ? 'text-gray-400' : ''}`}
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Unit
          </label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="£/€/$, kg, steps, hours, km, pages, etc."
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
      >
        <PlusCircle size={20} />
        Add Activity
      </button>
    </form>
  );
};