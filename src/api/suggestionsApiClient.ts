import fetch from 'cross-fetch';

interface ISuggestionsApiClient {
  suggestionsPostRequest: (input: string, limit: number) => Promise<string[]>;
}

export const suggestionsApiClient: ISuggestionsApiClient = {
  suggestionsPostRequest: async (input: string, limit: number): Promise<string[]> => {
    if (input.length === 0 || limit <= 0) {
      return Promise.resolve([]);
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        limit,
      }),
    };

    try {
      const response = await fetch(
        `https://ai-qa-wizard-text-similarity-dev-yls6dto53q-uc.a.run.app/inference`,
        requestOptions,
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const suggestions = await response.json();
      return suggestions;
    } catch (error) {
      console.error(`${error}`);
      return [];
    }
  },
};
