import { describe, it, expect, vi } from 'vitest';
import { fireEvent, queryByRole, render, within } from '@testing-library/react';
import { SuggestionsList } from './SuggestionsList';

describe('SuggestionsList tests', () => {
  const mockOnSuggestionChosen = vi.fn();
  const mockSuggestions = new Set<string>([
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

  const setupTest = (currentInput: string, suggestions: Set<string>) =>
    render(
      <SuggestionsList
        currentInput={currentInput}
        suggestions={suggestions}
        onSuggestionChosen={mockOnSuggestionChosen}
      />,
    );

  it('should render list item correctly with empty input', () => {
    const { getByRole, getAllByRole } = setupTest('', mockSuggestions);
    expect(getByRole('list')).toBeInTheDocument();
    const allListEntries = getAllByRole('listitem');
    const firstListEntry = within(allListEntries[0]);
    expect(firstListEntry.getByText([...mockSuggestions][0])).toBeInTheDocument();
  });

  it('should render list item correctly with filled out input', () => {
    const { getByRole, getAllByRole } = setupTest('mock input', mockSuggestions);
    expect(getByRole('list')).toBeInTheDocument();
    const allListEntries = getAllByRole('listitem');
    const firstListEntry = within(allListEntries[0]);
    expect(firstListEntry.getByText('mock input')).toBeInTheDocument();
  });

  it('should show the suggestions list separator', () => {
    const { getByText } = setupTest('mock input', mockSuggestions);
    expect(getByText('Suggestions')).toBeInTheDocument();
  });

  it('should render list of suggestions correctly', () => {
    const { getByText } = setupTest('mock input', mockSuggestions);
    mockSuggestions.forEach((mockSuggestion) => {
      expect(getByText(mockSuggestion)).toBeInTheDocument();
    });
  });

  it('should handle the empty suggestions correctly with input', () => {
    const { getByRole, getAllByRole, queryByText } = setupTest('mock input', new Set<string>());

    expect(getByRole('list')).toBeInTheDocument();
    expect(queryByText('Suggestions')).toBeNull();

    const allListEntries = getAllByRole('listitem');
    expect(allListEntries.length).toEqual(1);
    expect(within(allListEntries[0]).getByText('mock input')).toBeInTheDocument();
  });

  it('should handle the empty suggestions correctly without input', () => {
    const { getByRole, queryByText, queryByRole } = setupTest('', new Set<string>());
    expect(getByRole('list')).toBeInTheDocument();
    expect(queryByText('Suggestions')).toBeNull();
    expect(queryByRole('listitem')).toBeNull();
  });

  it('should handle the suggestion choice correctly', () => {
    const { getByText } = setupTest('', mockSuggestions);
    const selectedSuggestion = mockSuggestions.values().next().value;
    const suggestionListEntry = getByText(selectedSuggestion);
    expect(mockOnSuggestionChosen).toHaveBeenCalledTimes(0);
    fireEvent.click(suggestionListEntry);
    expect(mockOnSuggestionChosen).toHaveBeenCalledOnce;
    expect(mockOnSuggestionChosen).toHaveBeenCalledWith(selectedSuggestion);
  });
});
