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
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

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
    labels: activityNames.map(name => {
      return [
        name,
        React.createElement('button', {
          key: `delete-${name}`,
          onClick: () => onDelete(name),
          className: 'text-red-500 hover:text-red-700 ml-2',
          children: React.createElement(Trash2, { size: 16 })
        })
      ];
    }),
    datasets: [{
      data: activityNames.map(name => stats.get(name)?.value || 0),
      backgroundColor: [
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
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
        color: darkMode ? '#fff' : '#000',
        font: {
          weight: 'bold' as const,
          size: 14,
        },
        formatter: (value: number, context: any) => {
          if (value === 0) return '';
          const activity = stats.get(activityNames[context.dataIndex]);
          return `${value}${activity?.unit ? ` ${activity.unit}` : ''}`;
        },
        anchor: 'center' as const,
        align: 'center' as const,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#fff' : '#000',
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
          color: darkMode ? '#fff' : '#000',
          callback: (value: any) => {
            return activityNames[value];
          }
        }
      }
    },
  };

  const handleMonthChange = (increment: boolean) => {
    setSelectedDate(increment ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleMonthChange(false)}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {timeframe === 'monthly' 
              ? format(selectedDate, 'MMMM yyyy')
              : format(selectedDate, 'yyyy')}
          </span>
          <button
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
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === 'monthly'
                ? 'bg-blue-500 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === 'yearly'
                ? 'bg-blue-500 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Activities
        </h3>
        <div className="h-[600px]">
          <Bar 
            data={chartData} 
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};