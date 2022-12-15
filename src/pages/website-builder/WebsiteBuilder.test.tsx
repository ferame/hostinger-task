import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WebsiteBuilder } from './WebsiteBuilder';

describe('WebsiteBuilder tests', () => {
  const title = 'What type of website are you building?';
  const underTitleText = 'Start typing and get the suggestions to choose from.';

  const setupTest = () => render(<WebsiteBuilder />);

  it('should render title', () => {
    const { getByText } = setupTest();
    expect(getByText(title)).toBeVisible();
  });

  it('should render the text under the title', () => {
    const { getByText } = setupTest();
    expect(getByText(underTitleText)).toBeVisible();
  });

  it('should render the AutocompleteSearch pill without suggestions on initial load', () => {
    const { getByTestId, queryByTestId } = setupTest();
    expect(getByTestId('autocomplete-pill')).toBeVisible();
    expect(queryByTestId('suggestions-list')).toBeNull();
  });
});
