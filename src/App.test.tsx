import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App loads', () => {
  const setupTest = () => render(<App />);

  it('shows the WebsiteBuilder', () => {
    const { getByTestId } = setupTest();
    expect(getByTestId('website-builder')).toBeInTheDocument();
  });
});
