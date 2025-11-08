import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { colors, tokens } from '../styles';
import { AnimatedButton } from './ui/AnimatedButton';
import { AnimatedInput } from './ui/AnimatedInput';

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
      <AnimatedButton
        onClick={() => setIsExpanded(true)}
        variant="primary"
        size="lg"
        fullWidth
        icon={<UserPlus size={20} />}
        iconPosition="left"
        aria-label="Add team member to roster"
      >
        Add Team Member
      </AnimatedButton>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${tokens.borders.radius.lg} ${tokens.spacing.card.md} border-2 ${colors.components.card.shadow} transition-all ${colors.structural.bg.card} ${colors.semantic.primary.border}`}
    >
      <div className="space-y-3">
        <AnimatedInput
          id="firefighter-name"
          label="Full name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) validateName(e.target.value);
          }}
          onBlur={(e) => validateName(e.target.value)}
          placeholder="Full name (e.g., John Smith)"
          autoFocus
          error={errors.name}
          required
        />

        <AnimatedInput
          id="firefighter-station"
          label="Station number (optional)"
          value={fireStation}
          onChange={(e) => setFireStation(e.target.value)}
          placeholder="Station number (optional)"
        />
      </div>

      <div className={`flex ${tokens.spacing.gap.sm} mt-4`}>
        <AnimatedButton
          type="submit"
          disabled={!name.trim()}
          variant="primary"
          size="md"
          fullWidth
          aria-label="Add firefighter to rotation"
        >
          Add to Rotation
        </AnimatedButton>
        <AnimatedButton
          type="button"
          onClick={handleCancel}
          variant="ghost"
          size="md"
          fullWidth
          aria-label="Cancel adding firefighter"
        >
          Cancel
        </AnimatedButton>
      </div>
    </form>
  );
}
