import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { SuggestionsListEntry } from './SuggestionsListEntry';

describe('SuggestionsListEntry tests', () => {
  const mockOnClick = vi.fn();
  const testText = 'test text';

  const setupTest = (text: string) => render(<SuggestionsListEntry text={text} onClick={mockOnClick} />);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render list item correctly', () => {
    const { getByText } = setupTest(testText);
    expect(getByText(testText)).toBeInTheDocument();
  });

  it('should handle the click correctly', () => {
    const { getByText } = setupTest(testText);
    const listItem = getByText('test text');
    expect(mockOnClick).toBeCalledTimes(0);
    fireEvent.click(listItem);
    expect(mockOnClick).toBeCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(testText);
  });

  // Add test to check if it renders with longer string
});
