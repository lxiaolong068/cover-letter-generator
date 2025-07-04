import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card data-testid="card">Card content</Card>);
      const card = screen.getByTestId('card');

      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-xl', 'bg-surface', 'border');
    });

    it('renders different variants correctly', () => {
      const { rerender } = render(
        <Card variant="elevated" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('shadow-md', 'hover:shadow-lg');

      rerender(
        <Card variant="outlined" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('border-2', 'shadow-none');

      rerender(
        <Card variant="filled" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('bg-surface-container', 'border-none');
    });

    it('handles different padding options', () => {
      const { rerender } = render(
        <Card padding="none" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-0');

      rerender(
        <Card padding="sm" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-4');

      rerender(
        <Card padding="lg" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-8');
    });

    it('handles interactive state', () => {
      render(
        <Card interactive data-testid="card">
          Interactive card
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card).toHaveClass('cursor-pointer', 'hover:scale-[1.02]');
    });

    it('handles click events when interactive', () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick} data-testid="card">
          Clickable card
        </Card>
      );

      fireEvent.click(screen.getByTestId('card'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
  });

  describe('CardHeader', () => {
    it('renders correctly', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>);
      const header = screen.getByTestId('header');

      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5');
      expect(header).toHaveTextContent('Header content');
    });

    it('applies custom className', () => {
      render(
        <CardHeader className="custom-header" data-testid="header">
          Content
        </CardHeader>
      );
      expect(screen.getByTestId('header')).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('renders as h3 by default', () => {
      render(<CardTitle>Card Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Card Title');
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-on-surface');
    });

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('renders correctly', () => {
      render(<CardDescription data-testid="description">Description text</CardDescription>);
      const description = screen.getByTestId('description');

      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Description text');
      expect(description).toHaveClass('text-sm', 'text-on-surface-variant');
    });

    it('applies custom className', () => {
      render(
        <CardDescription className="custom-desc" data-testid="description">
          Text
        </CardDescription>
      );
      expect(screen.getByTestId('description')).toHaveClass('custom-desc');
    });
  });

  describe('CardContent', () => {
    it('renders correctly', () => {
      render(<CardContent data-testid="content">Content text</CardContent>);
      const content = screen.getByTestId('content');

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content text');
      expect(content).toHaveClass('pt-0');
    });

    it('applies custom className', () => {
      render(
        <CardContent className="custom-content" data-testid="content">
          Text
        </CardContent>
      );
      expect(screen.getByTestId('content')).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('renders correctly', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>);
      const footer = screen.getByTestId('footer');

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer content');
      expect(footer).toHaveClass('flex', 'items-center', 'pt-6');
    });

    it('applies custom className', () => {
      render(
        <CardFooter className="custom-footer" data-testid="footer">
          Content
        </CardFooter>
      );
      expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
    });
  });

  describe('Complete Card Structure', () => {
    it('renders all card components together', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test content paragraph</p>
          </CardContent>
          <CardFooter>
            <button>Test Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Title');
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test content paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument();
    });

    it('maintains proper semantic structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Semantic Test</CardTitle>
            <CardDescription>Testing semantic HTML structure</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content with proper semantics</p>
          </CardContent>
        </Card>
      );

      // Check that the heading is properly structured
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Semantic Test');

      // Check that description follows the title
      const description = screen.getByText('Testing semantic HTML structure');
      expect(description).toBeInTheDocument();
    });
  });
});
