import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { SuggestionsList } from './SuggestionsList';

describe('SuggestionsList tests', () => {
  const mockOnSuggestionChosen = vi.fn();
  const mockSuggestions = new Set([
    'Shoemaker',
    'Show Band',
    'Shoe Store',
    'Retail Shop',
    'Beachwear Shop',
    'Clothing Shop',
    'Accessories Shop',
    'Barber Shop',
    'Gift Shop',
    'Online Beachwear Shop',
  ]);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setupTest = (suggestions: Set<string>) =>
    render(<SuggestionsList suggestions={suggestions} onSuggestionChosen={mockOnSuggestionChosen} />);

  it('should render list item correctly', () => {
    const { getByRole } = setupTest(mockSuggestions);
    expect(getByRole('list')).toBeInTheDocument();
  });

  it('should show the current text at the top of the list separator', () => {
    const { getByText } = setupTest(mockSuggestions);
    expect(getByText('Current Mock Selection')).toBeInTheDocument();
  });

  it('should show the suggestions list separator', () => {
    const { getByText } = setupTest(mockSuggestions);
    expect(getByText('Suggestions')).toBeInTheDocument();
  });

  it('should render list entries correctly', () => {
    const { getByText } = setupTest(mockSuggestions);
    mockSuggestions.forEach((mockSuggestion) => {
      expect(getByText(mockSuggestion)).toBeInTheDocument();
    });
  });

  it('should handle the suggestion choice correctly', () => {
    const { getByText } = setupTest(mockSuggestions);
    const selectedSuggestion = mockSuggestions.values().next().value;
    const suggestionListEntry = getByText(selectedSuggestion);
    expect(mockOnSuggestionChosen).toHaveBeenCalledTimes(0);
    fireEvent.click(suggestionListEntry);
    expect(mockOnSuggestionChosen).toHaveBeenCalledOnce;
    expect(mockOnSuggestionChosen).toHaveBeenCalledWith(selectedSuggestion);
  });
});
