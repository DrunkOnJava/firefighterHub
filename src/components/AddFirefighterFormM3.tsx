import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { InputM3 } from './m3/InputM3';
import { ButtonM3 } from './m3/ButtonM3';

interface AddFirefighterFormM3Props {
  onAdd: (name: string, fireStation: string) => void;
}

export function AddFirefighterFormM3({ onAdd }: AddFirefighterFormM3Props) {
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
      <ButtonM3
        variant="filled"
        color="primary"
        size="lg"
        fullWidth
        onClick={() => setIsExpanded(true)}
        startIcon={<UserPlus size={20} />}
        className="shadow-materialm-2"
      >
        Add Team Member
      </ButtonM3>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-materialm-lg p-6 border-2 border-materialm-primary shadow-materialm-2 transition-all bg-white dark:bg-materialm-dark"
    >
      <div className="space-y-4">
        <InputM3
          id="firefighter-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) validateName(e.target.value);
          }}
          onBlur={(e) => validateName(e.target.value)}
          placeholder="Full name (e.g., John Smith)"
          error={errors.name}
          required
          autoFocus
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="w-full"
        />

        <InputM3
          id="firefighter-station"
          type="text"
          value={fireStation}
          onChange={(e) => setFireStation(e.target.value)}
          placeholder="Station number (optional)"
          className="w-full"
        />
      </div>

      <div className="flex gap-2 mt-6">
        <ButtonM3
          type="submit"
          variant="filled"
          color="primary"
          size="md"
          disabled={!name.trim()}
          fullWidth
          aria-label="Add firefighter to rotation"
        >
          Add to Rotation
        </ButtonM3>
        <ButtonM3
          type="button"
          variant="outlined"
          color="neutral"
          size="md"
          onClick={handleCancel}
          fullWidth
          aria-label="Cancel adding firefighter"
        >
          Cancel
        </ButtonM3>
      </div>
    </form>
  );
}
