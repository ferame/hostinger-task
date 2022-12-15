import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, vi } from 'vitest';
import { AutocompleteButton } from './AutocompleteButton';

describe('AutocompleteButton tests', () => {
  const onClickMock = vi.fn();

  const setupTest = (isLoading: boolean) => render(<AutocompleteButton isLoading={isLoading} onClick={onClickMock} />);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads button in static state', () => {
    const { getByTestId, queryByTestId, getByRole } = setupTest(false);
    expect(getByTestId('autocomplete-search-button')).toBeVisible();
    expect(getByRole('img')).toHaveProperty('alt', 'search');
    expect(queryByTestId('autocomplete-search-button-loading')).toBeNull();
  });

  it('loads button in loading state', () => {
    const { getByTestId, queryByTestId, getByRole } = setupTest(true);
    expect(getByTestId('autocomplete-search-button-loading')).toBeVisible();
    expect(getByRole('img')).toHaveProperty('alt', 'search');
    expect(queryByTestId('autocomplete-search-button')).toBeNull();
  });

  it('handles onClick in static state', async () => {
    const user = userEvent.setup();
    const { getByRole } = setupTest(false);
    const button = getByRole('button');
    expect(onClickMock).toHaveBeenCalledTimes(0);
    await user.click(button);
    expect(onClickMock).toHaveBeenCalledOnce();
  });

  it('handles onClick in loading state state', async () => {
    const user = userEvent.setup();
    const { getByRole } = setupTest(true);
    const button = getByRole('button');
    expect(onClickMock).toHaveBeenCalledTimes(0);
    await user.click(button);
    expect(onClickMock).toHaveBeenCalledOnce();
  });
});
