import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Booking } from '../types';
import { getBookingStats, TimeRange } from '../utils/statisticsUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsProps {
  bookings: Booking[];
}

export function Statistics({ bookings }: StatisticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const stats = getBookingStats(bookings, timeRange);

  const chartData = {
    labels: stats.labels,
    datasets: [
      {
        label: 'Anzahl Reservierungen',
        data: stats.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Reservierungen im Zeitverlauf',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiken</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyse der Reservierungen
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zeitraum
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === '30days'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Letzte 30 Tage
            </button>
            <button
              onClick={() => setTimeRange('6months')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === '6months'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Letzte 6 Monate
            </button>
            <button
              onClick={() => setTimeRange('1year')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === '1year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Letztes Jahr
            </button>
          </div>
        </div>

        <div className="h-[400px]">
          <Line options={options} data={chartData} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">
              Gesamtreservierungen
            </h3>
            <p className="mt-2 text-2xl font-semibold text-blue-900">
              {stats.data.reduce((sum, count) => sum + count, 0)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">
              Durchschnitt pro {timeRange === '30days' ? 'Tag' : 'Monat'}
            </h3>
            <p className="mt-2 text-2xl font-semibold text-green-900">
              {(stats.data.reduce((sum, count) => sum + count, 0) / stats.data.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">
              Maximale Reservierungen
            </h3>
            <p className="mt-2 text-2xl font-semibold text-purple-900">
              {Math.max(...stats.data)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}