import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WebsiteBuilder } from './WebsiteBuilder';

// TODO: test different parameters of suggestionsLimit and autocompleteDelayTime (if we don't just go and make delay time a constant)

describe('WebsiteBuilder tests', () => {
  const title = 'What type of website are you building?';
  const underTitleText = 'Start typing and get the suggestions to choose from.';

  const setupTest = () => render(<WebsiteBuilder />);

  it('should render title', () => {
    const { getByText } = setupTest();
    expect(getByText(title)).toBeInTheDocument();
  });

  it('should render the text under the title', () => {
    const { getByText } = setupTest();
    expect(getByText(underTitleText)).toBeInTheDocument();
  });

  it('should render the AutocompleteSearch pill without suggestions on initial load', () => {
    const { getByTestId, queryByTestId } = setupTest();
    expect(getByTestId('autocomplete-pill')).toBeInTheDocument();
    expect(queryByTestId('suggestions-list')).toBeNull();
  });
});
