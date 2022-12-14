import { describe, vi } from 'vitest';
import { suggestions } from '../mocks/handlers';
import { suggestionsApiClient } from './suggestionsApiClient';

describe('suggestionsApiClient tests', () => {
  describe('suggestionsPostRequest tests', () => {
    it('handles empty input correctly', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const response = await suggestionsApiClient.suggestionsPostRequest('', 10);
      expect(response).toEqual([]);
      expect(consoleErrorSpy).toBeCalledTimes(0);
    });

    it('handles limit of zero correctly', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const response = await suggestionsApiClient.suggestionsPostRequest('towel', 0);
      expect(response).toEqual([]);
      expect(consoleErrorSpy).toBeCalledTimes(0);
    });

    it('handles successful response correctly', async () => {
      const response = await suggestionsApiClient.suggestionsPostRequest('towel', 10);
      expect(response).toEqual(suggestions);
    });

    it('handles error response correctly', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const response = await suggestionsApiClient.suggestionsPostRequest('failme', 10);
      expect(response).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed successfully');
    });
  });
});
