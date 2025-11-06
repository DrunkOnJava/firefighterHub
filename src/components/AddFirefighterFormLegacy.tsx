import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { colors, tokens } from '../styles';

interface AddFirefighterFormProps {
  onAdd: (name: string, fireStation: string) => void;
}

export function AddFirefighterForm({ onAdd }: AddFirefighterFormProps) {
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
        className={`w-full font-semibold py-4 px-6 ${tokens.borders.radius.lg} ${colors.components.button.shadow} transition-all flex items-center justify-center ${tokens.spacing.gap.sm} focus-ring ${colors.semantic.primary.solid} ${colors.semantic.primary.hover} text-white`}
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
      className={`${tokens.borders.radius.lg} ${tokens.spacing.card.md} border-2 ${colors.components.card.shadow} transition-all ${colors.structural.bg.card} ${colors.semantic.primary.border}`}
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
            className={`w-full px-4 py-3 ${tokens.borders.radius.lg} border transition-all focus:outline-none focus:ring-2 ${colors.components.input.default} ${colors.structural.text.primary} ${colors.structural.border.default} ${colors.components.input.placeholder} focus:ring-blue-500 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.name && (
            <p id="name-error" className={`${colors.semantic.error.text} ${tokens.typography.body.small} mt-1`} role="alert">
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
            className={`w-full px-4 py-3 ${tokens.borders.radius.lg} border transition-all focus:outline-none focus:ring-2 ${colors.components.input.default} ${colors.structural.text.primary} ${colors.structural.border.default} ${colors.components.input.placeholder} focus:ring-blue-500`}
          />
        </div>
      </div>

      <div className={`flex ${tokens.spacing.gap.sm} mt-4`}>
        <button
          type="submit"
          disabled={!name.trim()}
          className={`flex-1 font-semibold py-2.5 ${tokens.borders.radius.lg} transition-all focus-ring ${colors.semantic.primary.solid} ${colors.semantic.primary.hover} disabled:${colors.components.button.disabled} text-white`}
          aria-label="Add firefighter to rotation"
        >
          Add to Rotation
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={`flex-1 font-semibold py-2.5 ${tokens.borders.radius.lg} transition-all focus-ring ${colors.components.button.secondary}`}
          aria-label="Cancel adding firefighter"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
