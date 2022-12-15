import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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

  const setupTest = (currentInput: string, suggestions: Set<string>, isApiClientCalled: boolean) =>
    render(
      <SuggestionsList
        isApiClientCalled={isApiClientCalled}
        currentInput={currentInput}
        suggestions={suggestions}
        onSuggestionChosen={mockOnSuggestionChosen}
      />,
    );

  const initialLoadTestSetup = (currentInput: string) => setupTest(currentInput, new Set(), false);

  describe('initial load, when apiClient has not been called yet', () => {
    it('should render list item correctly with empty input', () => {
      const { queryAllByRole, getByRole, queryByText } = initialLoadTestSetup('');
      expect(getByRole('list')).toBeVisible();

      expect(queryAllByRole('listitem').length).toEqual(0);
      expect(queryByText('Suggestions')).toBeNull();
      expect(queryByText('No suggestions found')).toBeNull();
    });

    it('should render list item correctly with filled out input', () => {
      const { getByRole, getAllByRole, queryByText } = initialLoadTestSetup('mock input');
      expect(getByRole('list')).toBeVisible();

      const allListEntries = getAllByRole('listitem');
      expect(allListEntries.length).toEqual(1);
      expect(within(allListEntries[0]).getByText('mock input')).toBeVisible();

      expect(queryByText('Suggestions')).toBeNull();
      expect(queryByText('No suggestions found')).toBeNull();
    });

    it('should not show the suggestions list separator with empty input', () => {
      const { queryByText } = initialLoadTestSetup('');
      expect(queryByText('Suggestions')).toBeNull();
    });

    it('should not show the suggestions list separator with input', () => {
      const { queryByText } = initialLoadTestSetup('mock input');
      expect(queryByText('Suggestions')).toBeNull();
    });

    it('should render list of suggestions correctly with empty input', () => {
      const { getByText } = setupTest('mock input', mockSuggestions, false);
      expect(getByText('Suggestions')).toBeDefined();
      mockSuggestions.forEach((mockSuggestion) => {
        expect(getByText(mockSuggestion)).toBeVisible();
      });
    });

    it('should render list of suggestions correctly with input', () => {
      const { getByText } = setupTest('mock input', mockSuggestions, false);
      expect(getByText('Suggestions')).toBeDefined();
      mockSuggestions.forEach((mockSuggestion) => {
        expect(getByText(mockSuggestion)).toBeVisible();
      });
    });
  });

  describe('after a suggestions search has already been run at least once', () => {
    it('should render list item correctly with empty input', () => {
      const { getByRole, getAllByRole, getByText } = setupTest('', mockSuggestions, true);
      expect(getByRole('list')).toBeVisible();

      const allListEntries = getAllByRole('listitem');
      expect(allListEntries.length).toEqual(mockSuggestions.size);

      const firstListEntry = within(allListEntries[0]);
      expect(firstListEntry.getByText([...mockSuggestions][0])).toBeVisible();
    });

    it('should render list item with filled out input', () => {
      const { getByRole, getAllByRole } = setupTest('mock input', mockSuggestions, true);
      expect(getByRole('list')).toBeVisible();

      const allListEntries = getAllByRole('listitem');
      const firstListEntry = within(allListEntries[0]);

      expect(firstListEntry.getByText('mock input')).toBeVisible();
      expect(allListEntries.length).toEqual(mockSuggestions.size + 1);
    });

    it('should show the suggestions list separator with empty input', () => {
      const { getByText } = setupTest('', mockSuggestions, true);
      expect(getByText('Suggestions')).toBeVisible();
    });

    it('should show the suggestions list separator', () => {
      const { getByText } = setupTest('mock input', mockSuggestions, true);
      expect(getByText('Suggestions')).toBeVisible();
    });

    it('should render list of suggestions with empty input', () => {
      const { getByText } = setupTest('mock input', mockSuggestions, true);
      mockSuggestions.forEach((mockSuggestion) => {
        expect(getByText(mockSuggestion)).toBeVisible();
      });
    });

    it('should render list of suggestions with input', () => {
      const { getByText } = setupTest('mock input', mockSuggestions, true);
      mockSuggestions.forEach((mockSuggestion) => {
        expect(getByText(mockSuggestion)).toBeVisible();
      });
    });

    it('should handle the empty suggestions with input', () => {
      const { getByRole, getAllByRole, getByText } = setupTest('mock input', new Set<string>(), true);

      expect(getByRole('list')).toBeVisible();
      expect(getByText('Suggestions')).toBeVisible();

      const allListEntries = getAllByRole('listitem');
      expect(allListEntries.length).toEqual(1);
      expect(within(allListEntries[0]).getByText('mock input')).toBeVisible();

      expect(getByText('No suggestions found')).toBeVisible();
    });

    it('should handle the empty suggestions without input', () => {
      const { getByRole, getByText, queryByRole } = setupTest('', new Set<string>(), true);
      expect(getByRole('list')).toBeVisible();
      expect(getByText('Suggestions')).toBeVisible();
      expect(getByRole('list')).toBeVisible();

      expect(queryByRole('listitem')).toBeNull();
      expect(getByText('No suggestions found')).toBeVisible();
    });

    it('should handle the current input click', async () => {
      const user = userEvent.setup();
      const { getByText } = setupTest('current input', mockSuggestions, true);
      const suggestionListEntry = getByText('current input');
      expect(mockOnSuggestionChosen).toHaveBeenCalledTimes(0);
      await user.click(suggestionListEntry);
      expect(mockOnSuggestionChosen).toHaveBeenCalledOnce();
      expect(mockOnSuggestionChosen).toHaveBeenCalledWith('current input');
    });

    it('should handle the suggestion choice', async () => {
      const user = userEvent.setup();
      const { getByText } = setupTest('', mockSuggestions, true);
      const selectedSuggestion = mockSuggestions.values().next().value;
      const suggestionListEntry = getByText(selectedSuggestion);
      expect(mockOnSuggestionChosen).toHaveBeenCalledTimes(0);
      await user.click(suggestionListEntry);
      expect(mockOnSuggestionChosen).toHaveBeenCalledOnce();
      expect(mockOnSuggestionChosen).toHaveBeenCalledWith(selectedSuggestion);
    });
  });
});
