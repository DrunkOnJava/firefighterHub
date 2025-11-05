import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  EmptyState,
  NoFirefightersEmptyState,
  NoScheduledHoldsEmptyState,
  NoSearchResultsEmptyState,
  ConnectionErrorEmptyState,
  NoDeactivatedFirefightersEmptyState,
  NoActivityEmptyState,
  NoReportsDataEmptyState,
} from '../EmptyState';

describe('EmptyState', () => {
  describe('Base EmptyState Component', () => {
    it('should render title and description', () => {
      render(
        <EmptyState
          title="Test Title"
          description="Test description"
        />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      render(
        <EmptyState
          title="Test"
          description="Test"
          icon={<div data-testid="test-icon">Icon</div>}
        />
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render action button when provided', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          title="Test"
          description="Test"
          action={{
            label: 'Test Action',
            onClick: handleClick,
          }}
        />
      );

      const button = screen.getByRole('button', { name: /test action/i });
      expect(button).toBeInTheDocument();

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not render action button when not provided', () => {
      render(
        <EmptyState
          title="Test"
          description="Test"
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('NoFirefightersEmptyState', () => {
    it('should show admin message when isAdminMode is true', () => {
      const handleAdd = vi.fn();
      render(
        <NoFirefightersEmptyState
          onAddFirefighter={handleAdd}
          isAdminMode={true}
        />
      );

      expect(screen.getByText('No Team Members Yet')).toBeInTheDocument();
      expect(screen.getByText(/get started by adding your first firefighter/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add first firefighter/i })).toBeInTheDocument();
    });

    it('should show non-admin message when isAdminMode is false', () => {
      const handleAdd = vi.fn();
      render(
        <NoFirefightersEmptyState
          onAddFirefighter={handleAdd}
          isAdminMode={false}
        />
      );

      expect(screen.getByText('No Team Members Yet')).toBeInTheDocument();
      expect(screen.getByText(/contact an administrator/i)).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onAddFirefighter when button clicked', async () => {
      const handleAdd = vi.fn();
      const user = userEvent.setup();

      render(
        <NoFirefightersEmptyState
          onAddFirefighter={handleAdd}
          isAdminMode={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /add first firefighter/i }));
      expect(handleAdd).toHaveBeenCalledTimes(1);
    });
  });

  describe('NoScheduledHoldsEmptyState', () => {
    it('should show admin message with action button when isAdminMode is true', () => {
      const handleSchedule = vi.fn();
      render(
        <NoScheduledHoldsEmptyState
          onScheduleHold={handleSchedule}
          isAdminMode={true}
        />
      );

      expect(screen.getByText('No Holds Scheduled')).toBeInTheDocument();
      expect(screen.getByText(/click on any date in the calendar/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /schedule first hold/i })).toBeInTheDocument();
    });

    it('should show non-admin message without button when isAdminMode is false', () => {
      const handleSchedule = vi.fn();
      render(
        <NoScheduledHoldsEmptyState
          onScheduleHold={handleSchedule}
          isAdminMode={false}
        />
      );

      expect(screen.getByText('No Holds Scheduled')).toBeInTheDocument();
      expect(screen.getByText(/no holds have been scheduled yet/i)).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('NoSearchResultsEmptyState', () => {
    it('should display search term in description', () => {
      const handleClear = vi.fn();
      render(
        <NoSearchResultsEmptyState
          searchTerm="test search"
          onClearSearch={handleClear}
        />
      );

      expect(screen.getByText('No Results Found')).toBeInTheDocument();
      expect(screen.getByText(/no firefighters match "test search"/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('should call onClearSearch when button clicked', async () => {
      const handleClear = vi.fn();
      const user = userEvent.setup();

      render(
        <NoSearchResultsEmptyState
          searchTerm="test"
          onClearSearch={handleClear}
        />
      );

      await user.click(screen.getByRole('button', { name: /clear search/i }));
      expect(handleClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('ConnectionErrorEmptyState', () => {
    it('should render error message and retry button', () => {
      const handleRetry = vi.fn();
      render(<ConnectionErrorEmptyState onRetry={handleRetry} />);

      expect(screen.getByText('Connection Error')).toBeInTheDocument();
      expect(screen.getByText(/unable to load data/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry connection/i })).toBeInTheDocument();
    });

    it('should call onRetry when button clicked', async () => {
      const handleRetry = vi.fn();
      const user = userEvent.setup();

      render(<ConnectionErrorEmptyState onRetry={handleRetry} />);

      await user.click(screen.getByRole('button', { name: /retry connection/i }));
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Static Empty States', () => {
    it('should render NoDeactivatedFirefightersEmptyState', () => {
      render(<NoDeactivatedFirefightersEmptyState />);
      expect(screen.getByText('No Deactivated Members')).toBeInTheDocument();
    });

    it('should render NoActivityEmptyState', () => {
      render(<NoActivityEmptyState />);
      expect(screen.getByText('No Activity Yet')).toBeInTheDocument();
    });

    it('should render NoReportsDataEmptyState', () => {
      render(<NoReportsDataEmptyState />);
      expect(screen.getByText('No Data Available')).toBeInTheDocument();
    });
  });
});
