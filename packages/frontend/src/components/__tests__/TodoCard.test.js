import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

describe('TodoCard Overdue Indicator', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Freeze today to 2026-03-24
    jest.useFakeTimers().setSystemTime(new Date('2026-03-24'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show "· Overdue" label and overdue CSS class for incomplete todo with past due date', () => {
    const overdueTodo = { id: 2, title: 'Overdue Task', dueDate: '2026-03-20', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

    expect(screen.getByText(/· Overdue/)).toBeInTheDocument();
    const dueDateEl = container.querySelector('.todo-due-date');
    expect(dueDateEl).toHaveClass('todo-due-date--overdue');
  });

  it('should NOT show overdue indicator for incomplete todo with today\'s due date', () => {
    const todayTodo = { id: 3, title: 'Due Today', dueDate: '2026-03-24', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);

    expect(screen.queryByText(/· Overdue/)).not.toBeInTheDocument();
  });

  it('should NOT show overdue indicator for incomplete todo with future due date', () => {
    const futureTodo = { id: 4, title: 'Future Task', dueDate: '2026-04-01', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

    expect(screen.queryByText(/· Overdue/)).not.toBeInTheDocument();
  });

  it('should NOT show overdue indicator for incomplete todo with no due date', () => {
    const noDateTodo = { id: 5, title: 'No Date Task', dueDate: null, completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={noDateTodo} {...mockHandlers} isLoading={false} />);

    expect(screen.queryByText(/· Overdue/)).not.toBeInTheDocument();
  });

  it('should NOT show overdue indicator for completed todo with past due date', () => {
    const completedOverdueTodo = { id: 6, title: 'Done Task', dueDate: '2026-03-20', completed: 1, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);

    expect(screen.queryByText(/· Overdue/)).not.toBeInTheDocument();
  });

  it('should remove overdue indicator when todo is rendered as completed (US2)', () => {
    const overdueTodo = { id: 7, title: 'Completing Task', dueDate: '2026-03-20', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText(/· Overdue/)).toBeInTheDocument();

    const completedTodo = { ...overdueTodo, completed: 1 };
    rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText(/· Overdue/)).not.toBeInTheDocument();
  });

  it('should restore overdue indicator when completed todo is marked incomplete again (US2)', () => {
    const completedTodo = { id: 8, title: 'Re-opening Task', dueDate: '2026-03-20', completed: 1, createdAt: '2026-01-01T00:00:00Z' };
    const { rerender } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText(/· Overdue/)).not.toBeInTheDocument();

    const incompleteTodo = { ...completedTodo, completed: 0 };
    rerender(<TodoCard todo={incompleteTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText(/· Overdue/)).toBeInTheDocument();
  });
});

