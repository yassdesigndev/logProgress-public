import React, { useState } from 'react';
import { Activity } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { format, parseISO, subMonths, addMonths, startOfYear, endOfYear } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DashboardProps {
  activities: Activity[];
  onDelete: (name: string) => void;
  darkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, onDelete, darkMode }) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getActivityStats = () => {
    const filteredActivities = activities.filter(activity => {
      const date = parseISO(activity.date);
      if (timeframe === 'monthly') {
        return format(date, 'MMM yyyy') === format(selectedDate, 'MMM yyyy');
      } else {
        const start = startOfYear(selectedDate);
        const end = endOfYear(selectedDate);
        return date >= start && date <= end;
      }
    });

    const stats = new Map<string, { value: number; unit: string }>();

    filteredActivities.forEach(activity => {
      const name = activity.name;
      const currentStats = stats.get(name);
      stats.set(name, {
        value: (currentStats?.value || 0) + (activity.quantity?.value || 0),
        unit: activity.quantity?.unit || ''
      });
    });

    return stats;
  };

  const stats = getActivityStats();
  const activityNames = Array.from(new Set(activities.map(a => a.name)));

  const chartData = {
    labels: activityNames,
    datasets: [{
      data: activityNames.map(name => stats.get(name)?.value || 0),
      backgroundColor: darkMode
        ? [
            'rgba(96, 165, 250, 0.9)',
            'rgba(167, 139, 250, 0.9)',
            'rgba(248, 113, 113, 0.9)',
            'rgba(52, 211, 153, 0.9)',
            'rgba(251, 191, 36, 0.9)',
          ]
        : [
            'rgba(59, 130, 246, 0.9)',
            'rgba(124, 58, 237, 0.9)',
            'rgba(239, 68, 68, 0.9)',
            'rgba(16, 185, 129, 0.9)',
            'rgba(245, 158, 11, 0.9)',
          ],
      borderWidth: 0,
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false, // Disable datalabels inside bars
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          font: {
            family: 'Inter var',
            size: 12,
          },
          callback: (value: number) => {
            return value.toLocaleString();
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          font: {
            family: 'Inter var',
            size: 12,
            weight: 'bold',
          },
          callback: (value: any, index: number) => {
  const name = activityNames[index];
  const stat = stats.get(name);
  const valueWithUnit = `${stat?.value}${stat?.unit ? ` ${stat.unit}` : ''}`;
  return [name, valueWithUnit]; // ← this creates two lines
          }
        }
      }
    },
  };

  const handleDateChange = (increment: boolean) => {
    if (timeframe === 'monthly') {
      setSelectedDate(increment ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
    } else {
      setSelectedDate(new Date(selectedDate.getFullYear() + (increment ? 1 : -1), 0, 1));
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass card p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handleDateChange(false)}
              className={`p-1 rounded-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              <Calendar size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {timeframe === 'monthly' 
                  ? format(selectedDate, 'MMMM yyyy')
                  : format(selectedDate, 'yyyy')}
              </span>
            </div>
            <button
              onClick={() => handleDateChange(true)}
              className={`p-2 rounded-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <ChevronRight size={20} />
            </button>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : darkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeframe('yearly')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeframe === 'yearly'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : darkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="h-[600px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};