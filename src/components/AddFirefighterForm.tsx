import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface AddFirefighterFormProps {
  onAdd: (name: string, fireStation: string) => void;
  isDarkMode?: boolean;
}

export function AddFirefighterForm({ onAdd, isDarkMode = true }: AddFirefighterFormProps) {
  const [name, setName] = useState('');
  const [fireStation, setFireStation] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState({ name: '' });

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      return false;
    }
    if (value.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateName(name)) {
      onAdd(name.trim(), fireStation.trim());
      setName('');
      setFireStation('');
      setErrors({ name: '' });
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setFireStation('');
    setErrors({ name: '' });
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`w-full font-semibold py-4 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 focus-ring ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        aria-label="Add team member to roster"
      >
        <UserPlus size={20} />
        Add Team Member
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-lg p-4 border-2 shadow-lg transition-all ${
        isDarkMode
          ? 'bg-gray-800 border-blue-600'
          : 'bg-white border-blue-500'
      }`}
    >
      <div className="space-y-3">
        <div>
          <label htmlFor="firefighter-name" className="sr-only">
            Full name
          </label>
          <input
            id="firefighter-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) validateName(e.target.value);
            }}
            onBlur={(e) => validateName(e.target.value)}
            placeholder="Full name (e.g., John Smith)"
            autoFocus
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-500 focus:ring-blue-500'
                : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400 focus:ring-blue-500'
            } ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.name && (
            <p id="name-error" className="text-red-400 text-xs mt-1" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="firefighter-station" className="sr-only">
            Station number (optional)
          </label>
          <input
            id="firefighter-station"
            type="text"
            value={fireStation}
            onChange={(e) => setFireStation(e.target.value)}
            placeholder="Station number (optional)"
            className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-500 focus:ring-blue-500'
                : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400 focus:ring-blue-500'
            }`}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={!name.trim()}
          className={`flex-1 font-semibold py-2.5 rounded-lg transition-all focus-ring ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white'
          }`}
          aria-label="Add firefighter to rotation"
        >
          Add to Rotation
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={`flex-1 font-semibold py-2.5 rounded-lg transition-all focus-ring ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
          }`}
          aria-label="Cancel adding firefighter"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
