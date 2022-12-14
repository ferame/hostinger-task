import { waitFor } from '@testing-library/dom';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { suggestionsApiClient } from '../../api/suggestionsApiClient';
import { AutocompleteSearch } from './AutocompleteSearch';

describe('AutocompleteSearch tests', () => {
  let suggestionsPostRequestSpy = vi.spyOn(suggestionsApiClient, 'suggestionsPostRequest');

  const mockServerResponse = [
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
  ];

  afterEach(() => {
    vi.resetAllMocks();
  });

  const setupTest = (suggestionsLimit: number, autocompleteDelayTimeMs: number) =>
    render(
      <AutocompleteSearch suggestionsLimit={suggestionsLimit} autocompleteDelayTimeMs={autocompleteDelayTimeMs} />,
    );

  describe('Autocomplete loads correctly', () => {
    it('should render AutocompleteSearch pill', () => {
      const { getByTestId } = setupTest(10, 1000);
      expect(getByTestId('autocomplete-pill')).toBeInTheDocument();
    });

    it('should render input', () => {
      const { getByTestId } = setupTest(10, 1000);
      expect(getByTestId('autocomplete-input-field')).toBeInTheDocument();
    });

    it('should render button', () => {
      const { getByTestId } = setupTest(10, 1000);
      expect(getByTestId('autocomplete-search-button')).toBeInTheDocument();
    });

    it('should not have the suggestions list', () => {
      const { queryByTestId } = setupTest(10, 1000);
      expect(queryByTestId('suggestions-list')).toBeNull();
    });
  });

  describe('Autocomplete with text input', () => {
    beforeEach(() => {
      suggestionsPostRequestSpy.mockReset();
      suggestionsPostRequestSpy.mockReturnValue(Promise.resolve(mockServerResponse));
    });

    it('should show suggestion list after typing', async () => {
      const user = userEvent.setup();
      const { getByText, getByRole, queryByRole, getAllByRole, queryByText } = setupTest(10, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      expect(suggestionsPostRequestSpy).toBeCalledTimes(0);
      expect(queryByRole('list')).toBeNull();

      await user.type(inputBox, 'Shop');

      expect(inputBox).toHaveValue('Shop');
      expect(getByRole('list')).toBeDefined();
      const allListEntries = getAllByRole('listitem');
      expect(allListEntries.length).toEqual(1);
      expect(within(allListEntries[0]).getByText('Shop')).toBeInTheDocument();
      expect(queryByText('Suggestions')).toBeNull();

      await waitFor(() => expect(getByText('Suggestions')).toBeInTheDocument());
      expect(suggestionsPostRequestSpy).toHaveBeenCalledOnce();
      expect(suggestionsPostRequestSpy).toBeCalledWith('Shop', 10);

      mockServerResponse.forEach((response) => {
        expect(getByText(response)).toBeInTheDocument();
      });
    });

    it('should call apiClient with expected suggestion limit', async () => {
      const user = userEvent.setup();
      const { getByText, getByRole, queryByRole, getAllByRole, queryByText } = setupTest(5, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      expect(suggestionsPostRequestSpy).toBeCalledTimes(0);
      expect(queryByRole('list')).toBeNull();

      await user.type(inputBox, 'Shop');

      expect(inputBox).toHaveValue('Shop');
      expect(getByRole('list')).toBeDefined();
      const allListEntries = getAllByRole('listitem');
      expect(allListEntries.length).toEqual(1);
      expect(within(allListEntries[0]).getByText('Shop')).toBeInTheDocument();
      expect(queryByText('Suggestions')).toBeNull();

      await waitFor(() => expect(getByText('Suggestions')).toBeInTheDocument());
      expect(suggestionsPostRequestSpy).toHaveBeenCalledOnce();
      expect(suggestionsPostRequestSpy).toBeCalledWith('Shop', 5);
    });

    it('should show the change of input in suggestions list', async () => {
      const user = userEvent.setup();
      const { getByText, getByRole, queryByRole, getAllByRole, queryByText } = setupTest(10, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      expect(suggestionsPostRequestSpy).toBeCalledTimes(0);
      expect(queryByRole('list')).toBeNull();

      await user.type(inputBox, 'Shop');

      expect(inputBox).toHaveValue('Shop');
      expect(getByRole('list')).toBeDefined();
      const allListEntries = getAllByRole('listitem');
      expect(allListEntries.length).toEqual(1);
      expect(within(allListEntries[0]).getByText('Shop')).toBeInTheDocument();
      expect(queryByText('Suggestions')).toBeNull();

      await waitFor(() => expect(getByText('Suggestions')).toBeInTheDocument());
      expect(suggestionsPostRequestSpy).toHaveBeenCalledOnce();
      expect(suggestionsPostRequestSpy).toBeCalledWith('Shop', 10);

      mockServerResponse.forEach((response) => {
        expect(getByText(response)).toBeInTheDocument();
      });
      suggestionsPostRequestSpy.mockReturnValueOnce(Promise.resolve([...mockServerResponse, 'New test entry']));

      await user.type(inputBox, 's');

      await waitFor(() => expect(getByText('New test entry')).toBeInTheDocument());
      mockServerResponse.forEach((response) => {
        expect(getByText(response)).toBeInTheDocument();
      });
      expect(suggestionsPostRequestSpy).toHaveBeenCalledTimes(2);
      expect(suggestionsPostRequestSpy).toHaveBeenLastCalledWith('Shops', 10);
    });

    it('should handle the suggestion selection successfully', async () => {
      const user = userEvent.setup();
      const { getByText, getByRole, getByTestId, findByTestId } = setupTest(10, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      expect(suggestionsPostRequestSpy).toBeCalledTimes(0);
      await user.type(inputBox, 'Shop');
      expect(inputBox).toHaveValue('Shop');

      await waitFor(() => {
        expect(getByText('Suggestions')).toBeInTheDocument();
      });

      expect(suggestionsPostRequestSpy).toHaveBeenCalledOnce();
      expect(suggestionsPostRequestSpy).toBeCalledWith('Shop', 10);

      expect(inputBox).toHaveValue('Shop');
      const selectedSuggestion = getByText(mockServerResponse[1]);
      await user.click(selectedSuggestion);
      expect(inputBox).toHaveValue(mockServerResponse[1]);
    });

    it('should handle button click correctly', async () => {
      const user = userEvent.setup();
      const { getByTestId, getByText } = setupTest(10, 1000);

      const searchButton = getByTestId('autocomplete-search-button');
      expect(suggestionsPostRequestSpy).toBeCalledTimes(0);

      await user.click(searchButton);

      await waitFor(() => {
        expect(getByText('Suggestions')).toBeInTheDocument();
      });
      expect(suggestionsPostRequestSpy).toHaveBeenCalledWith('', 10);
    });
  });
});
