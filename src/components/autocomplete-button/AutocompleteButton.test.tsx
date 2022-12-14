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

  it('loads button successfully in static state', () => {
    const { getByTestId, queryByTestId } = setupTest(false);
    expect(getByTestId('autocomplete-search-button')).toBeInTheDocument();
    expect(queryByTestId('autocomplete-search-button-loading')).toBeNull();
  });

  it('loads button successfully in loading state', () => {
    const { getByTestId, queryByTestId } = setupTest(true);
    expect(getByTestId('autocomplete-search-button-loading')).toBeInTheDocument();
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