import { describe, it, expect, vi } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render } from '@testing-library/react';
import { AutocompleteSearch } from './AutocompleteSearch';
import { sleep } from '../../utils/sleep';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { suggestionsApiClient } from '../../api/suggestionsApiClient';
import { act } from 'react-dom/test-utils';

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

  describe('Autocomplete initial load', () => {
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

    it('should have an image on the button', () => {
      const { getByRole } = setupTest(10, 1000);
      expect(getByRole('img')).toHaveProperty('alt', 'search');
    });

    it('should not have the suggestions list', () => {
      const { queryByTestId } = setupTest(10, 1000);
      expect(queryByTestId('suggestions-list')).toBeNull();
    });
  });

  describe('Autocomplete with text input', () => {
    beforeEach(() => {
      suggestionsPostRequestSpy.mockReturnValue(Promise.resolve(mockServerResponse));
    });

    afterEach(() => {
      suggestionsPostRequestSpy.mockRestore();
    });

    it('should show suggestion list after typing', async () => {
      const user = userEvent.setup();
      const { getByText, getByRole, queryByTestId } = setupTest(10, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      expect(suggestionsPostRequestSpy).toBeCalledTimes(0);
      await user.type(inputBox, 'Shop');
      expect(inputBox).toHaveValue('Shop');

      expect(queryByTestId('suggestions-list')).toBeNull();

      await waitFor(() => expect(queryByTestId('suggestions-list')).toBeInTheDocument());
      expect(suggestionsPostRequestSpy).toHaveBeenCalledOnce();
      expect(suggestionsPostRequestSpy).toBeCalledWith('Shop', 10);

      mockServerResponse.forEach((response) => {
        expect(getByText(response)).toBeInTheDocument();
      });
    });

    it.todo('should show the change of input in suggestions list', async () => {});

    it('should handle the suggestion selection successfully', async () => {
      const user = userEvent.setup();
      const { getByText, getByRole, queryByTestId, findByTestId } = setupTest(10, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      expect(suggestionsPostRequestSpy).toBeCalledTimes(0);
      await user.type(inputBox, 'Shop');
      expect(inputBox).toHaveValue('Shop');

      expect(queryByTestId('suggestions-list')).toBeNull();
      await waitFor(() => expect(queryByTestId('suggestions-list')).toBeInTheDocument());
      expect(suggestionsPostRequestSpy).toHaveBeenCalledOnce();
      expect(suggestionsPostRequestSpy).toBeCalledWith('Shop', 10);

      expect(inputBox).toHaveValue('Shop');
      const selectedSuggestion = getByText(mockServerResponse[1]);
      await user.click(selectedSuggestion);
      expect(inputBox).toHaveValue(mockServerResponse[1]);
    });
  });
});
