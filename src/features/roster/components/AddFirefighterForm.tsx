import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
      <Button
        onClick={() => setIsExpanded(true)}
        variant="default"
        size="lg"
        className="w-full"
        aria-label="Add team member to roster"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Add Team Member
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg p-4 border-2 shadow-lg transition-all bg-card border-primary"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="firefighter-name">
            Full name
          </Label>
          <Input
            id="firefighter-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) validateName(e.target.value);
            }}
            onBlur={(e) => validateName(e.target.value)}
            placeholder="Full name (e.g., John Smith)"
            autoFocus
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "firefighter-name-error" : undefined}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p
              id="firefighter-name-error"
              className="text-destructive text-sm mt-1"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firefighter-station">
            Station number (optional)
          </Label>
          <Input
            id="firefighter-station"
            value={fireStation}
            onChange={(e) => setFireStation(e.target.value)}
            placeholder="Station number (optional)"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          type="submit"
          disabled={!name.trim()}
          variant="default"
          size="default"
          className="flex-1"
          aria-label="Add firefighter to rotation"
        >
          Add to Rotation
        </Button>
        <Button
          type="button"
          onClick={handleCancel}
          variant="ghost"
          size="default"
          className="flex-1"
          aria-label="Cancel adding firefighter"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
