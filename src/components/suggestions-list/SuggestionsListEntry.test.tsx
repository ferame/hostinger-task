import { fireEvent, render, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SuggestionsListEntry } from './SuggestionsListEntry';

describe('SuggestionsListEntry tests', () => {
  const mockOnClick = vi.fn();
  const testText = 'test text';

  const setupTest = (text: string) => render(<SuggestionsListEntry text={text} onClick={mockOnClick} />);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render list item', () => {
    const { getByRole } = setupTest(testText);
    const listItem = getByRole('listitem');
    expect(within(listItem).getByText(testText)).toBeVisible();
    expect(within(listItem).getByRole('button')).toBeVisible();
  });

  it('should render list item with empty string', () => {
    const { getByRole } = setupTest('');
    const listItem = getByRole('listitem');
    expect(listItem).toBeVisible();
    expect(within(listItem).getByRole('button')).toBeVisible();
  });

  it('should handle the click', () => {
    const { getByText } = setupTest(testText);
    const listItem = getByText('test text');
    expect(mockOnClick).toBeCalledTimes(0);
    fireEvent.click(listItem);
    expect(mockOnClick).toBeCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(testText);
  });
});
