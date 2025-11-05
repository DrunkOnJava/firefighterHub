import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Size variants', () => {
    it('should render small spinner', () => {
      render(<LoadingSpinner size="sm" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-4', 'h-4', 'border-2');
    });

    it('should render medium spinner (default)', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-8', 'h-8', 'border-2');
    });

    it('should render large spinner', () => {
      render(<LoadingSpinner size="lg" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-12', 'h-12', 'border-4');
    });

    it('should render extra large spinner', () => {
      render(<LoadingSpinner size="xl" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-16', 'h-16', 'border-4');
    });
  });

  describe('Loading text', () => {
    it('should not render text when not provided', () => {
      render(<LoadingSpinner />);
      const text = screen.queryByText(/loading/i);
      expect(text).not.toBeInTheDocument();
    });

    it('should render loading text when provided', () => {
      render(<LoadingSpinner text="Loading calendar..." />);
      const text = screen.getByText('Loading calendar...');
      expect(text).toBeInTheDocument();
    });

    it('should use text as aria-label', () => {
      render(<LoadingSpinner text="Loading data" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading data');
    });

    it('should have default aria-label when text not provided', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should apply appropriate text size for sm spinner', () => {
      render(<LoadingSpinner size="sm" text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-xs');
    });

    it('should apply appropriate text size for md spinner', () => {
      render(<LoadingSpinner size="md" text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-sm');
    });

    it('should apply appropriate text size for lg spinner', () => {
      render(<LoadingSpinner size="lg" text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-base');
    });

    it('should apply appropriate text size for xl spinner', () => {
      render(<LoadingSpinner size="xl" text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-xl', 'font-semibold');
    });
  });

  describe('Full page variant', () => {
    it('should not render full page by default', () => {
      const { container } = render(<LoadingSpinner />);
      const fullPageDiv = container.querySelector('.min-h-screen');
      expect(fullPageDiv).not.toBeInTheDocument();
    });

    it('should render full page when fullPage is true', () => {
      const { container } = render(<LoadingSpinner fullPage />);
      const fullPageDiv = container.querySelector('.min-h-screen');
      expect(fullPageDiv).toBeInTheDocument();
    });

    it('should center content in full page mode', () => {
      const { container } = render(<LoadingSpinner fullPage />);
      const fullPageDiv = container.querySelector('.min-h-screen');
      expect(fullPageDiv).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should render text in full page mode', () => {
      render(<LoadingSpinner size="xl" text="Loading Hold List Manager..." fullPage />);
      const text = screen.getByText('Loading Hold List Manager...');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="status" for screen readers', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should be animating (has animate-spin class)', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should have border-t-transparent for spinning effect', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('border-t-transparent');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });

    it('should preserve default classes when custom className is added', () => {
      const { container } = render(<LoadingSpinner className="my-custom-class" />);
      const wrapper = container.querySelector('.flex.flex-col.items-center');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('my-custom-class');
    });
  });

  describe('Visual consistency', () => {
    it('should use semantic scheduled border color', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('border-blue-600');
    });

    it('should use rounded-full shape', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('rounded-full');
    });

    it('should use structural text secondary color for text', () => {
      render(<LoadingSpinner text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-gray-400');
    });
  });
});
