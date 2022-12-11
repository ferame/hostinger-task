import { describe, it, expect } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, render } from '@testing-library/react';
import { AutocompleteSearch } from './AutocompleteSearch';
import { sleep } from '../../utils/sleep';

// TODO: test different API call cases (if api gives 500 or if response is not a valid json)

describe('AutocompleteSearch tests', () => {
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

  const server = setupServer(
    rest.post('https://ai-qa-wizard-text-similarity-dev-yls6dto53q-uc.a.run.app/inference', async (req, res, ctx) => {
      await sleep(1000);
      return res(ctx.json(mockServerResponse));
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

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

    // Vitest works weirdly, and somehow this will resolve to success even if I change it to toBeDefined()
    it('should not have the suggestions list', () => {
      const { queryByTestId } = setupTest(10, 1000);
      expect(queryByTestId('suggestions-list')).toBeNull();
    });
  });

  describe('Autocomplete with text input', () => {
    it('should show suggestion list after typing', async () => {
      const { getByText, getByRole, queryByTestId } = setupTest(10, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      fireEvent.change(inputBox, { target: { value: 'Shop' } });
      expect(inputBox).toHaveValue('Shop');

      expect(queryByTestId('suggestions-list')).toBeNull();
      await sleep(2500);
      expect(queryByTestId('suggestions-list')).toBeInTheDocument();

      mockServerResponse.forEach((response) => {
        expect(getByText(response)).toBeInTheDocument();
      });
    });

    it('should show the change of input in suggestions list', async () => {});

    it('should handle the suggestion selection successfully', async () => {
      const { getByText, getByRole, queryByTestId, findByTestId } = setupTest(10, 1000);

      const inputBox = getByRole('textbox');
      expect(inputBox).toHaveValue('');
      fireEvent.change(inputBox, { target: { value: 'Shop' } });
      expect(inputBox).toHaveValue('Shop');

      expect(queryByTestId('suggestions-list')).toBeNull();
      await sleep(2500);
      expect(queryByTestId('suggestions-list')).toBeInTheDocument();

      expect(inputBox).toHaveValue('Shop');
      const selectedSuggestion = getByText(mockServerResponse[1]);
      fireEvent.click(selectedSuggestion);
      expect(inputBox).toHaveValue(mockServerResponse[1]);
    });
  });
});
