import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { loadSettings, saveSettings } from '../utils/storage';
import { formatDayName } from '../utils/timeUtils';
import type { RestaurantSettings, DaySchedule } from '../types';

interface RestaurantSettingsProps {
  onSave: (settings: RestaurantSettings) => void;
}

export function RestaurantSettings({ onSave }: RestaurantSettingsProps) {
  const [settings, setSettings] = useState<RestaurantSettings>(() => loadSettings());
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    onSave(settings);
    setIsEditing(false);
  };

  const handleDayChange = (
    day: keyof RestaurantSettings['schedule'],
    changes: Partial<DaySchedule>
  ) => {
    setSettings({
      ...settings,
      schedule: {
        ...settings.schedule,
        [day]: {
          ...settings.schedule[day],
          ...changes,
        },
      },
    });
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-medium">Öffnungszeiten</h2>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Bearbeiten
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {(Object.keys(settings.schedule) as Array<keyof RestaurantSettings['schedule']>).map((day) => {
            const schedule = settings.schedule[day];
            return (
              <div key={day} className="flex items-center text-gray-600">
                <span className="w-32 font-medium">{formatDayName(day)}:</span>
                {schedule.isOpen ? (
                  <span>{schedule.openingTime} - {schedule.closingTime} Uhr</span>
                ) : (
                  <span className="text-red-600">Geschlossen</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium">Öffnungszeiten bearbeiten</h2>
        </div>
        
        {(Object.keys(settings.schedule) as Array<keyof RestaurantSettings['schedule']>).map((day) => {
          const schedule = settings.schedule[day];
          return (
            <div key={day} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{formatDayName(day)}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={schedule.isOpen}
                    onChange={(e) => handleDayChange(day, { isOpen: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {schedule.isOpen ? 'Geöffnet' : 'Geschlossen'}
                  </span>
                </label>
              </div>
              
              {schedule.isOpen && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Öffnet um
                    </label>
                    <input
                      type="time"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={schedule.openingTime}
                      onChange={(e) => handleDayChange(day, { openingTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Schließt um
                    </label>
                    <input
                      type="time"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={schedule.closingTime}
                      onChange={(e) => handleDayChange(day, { closingTime: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}