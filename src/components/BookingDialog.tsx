import React, { useState } from 'react';
import { X } from 'lucide-react';
import { generateTimeSlots } from '../utils/timeUtils';
import type { Booking } from '../types';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (booking: Omit<Booking, 'id' | 'tableId'>) => void;
  availabilityMessage?: string;
  showConfirmButton?: boolean;
  onConfirm?: () => void;
}

export function BookingDialog({ 
  isOpen, 
  onClose, 
  onBook, 
  availabilityMessage,
  showConfirmButton,
  onConfirm
}: BookingDialogProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    customerName: '',
  });

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const selectedDate = formData.date ? new Date(formData.date) : null;
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Neue Buchung</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {availabilityMessage && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-800">
            {availabilityMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Datum
            </label>
            <input
              type="date"
              required
              min={today}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Uhrzeit
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              disabled={!formData.date || timeSlots.length === 0}
            >
              <option value="">Bitte wählen</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time} Uhr
                </option>
              ))}
            </select>
            {formData.date && timeSlots.length === 0 && (
              <p className="mt-1 text-sm text-red-600">
                An diesem Tag ist das Restaurant geschlossen.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Anzahl Personen
            </label>
            <input
              type="number"
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Abbrechen
            </button>
            {showConfirmButton ? (
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
              >
                Tischkombination bestätigen
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                disabled={!formData.date || !formData.time || timeSlots.length === 0}
              >
                Verfügbarkeit prüfen
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}