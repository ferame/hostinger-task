import { useState, useCallback, Fragment } from 'react';
import { debounce } from '../../utils/debounce';
import { SuggestionsList } from '../../components/suggestions-list/SuggestionsList';
import magnifyingGlass from '../../assets/magnifying-glass.svg';

interface IAutocompleteSearch {
  suggestionsLimit: number;
  autocompleteDelayTimeMs: number;
}

const LOADING_BUTTON_STYLING =
  'border-6 border-t-6 border-hostinger-hover-grey border-t-hostinger-purple-deep animate-spin';
const SEARCH_BUTTON_STYLING = 'focus:border-2 focus:border-hostinger-purple-opaque';

const suggestionsApiService = async (input: string, limit: number): Promise<string[]> => {
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
    console.error(`Error: ${error}`);
    return [];
  }
};

export const AutocompleteSearch: React.FC<IAutocompleteSearch> = ({ suggestionsLimit, autocompleteDelayTimeMs }) => {
  const [textInput, setTextInput] = useState('');
  const [suggestions, setSuggestions] = useState(new Set<string>());
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestions = useCallback(async (input: string) => {
    setIsLoading(true);
    const retrievedSuggestions = await suggestionsApiService(input, suggestionsLimit);
    setSuggestions(new Set(retrievedSuggestions));
    setIsLoading(false);
  }, []);

  const debouncedGetSuggestions = useCallback(
    debounce((input: string) => getSuggestions(input), autocompleteDelayTimeMs),
    [],
  );

  const updateValue = (newInput: string) => {
    setTextInput(newInput);
    debouncedGetSuggestions(newInput);
  };

  return (
    <Fragment>
      <div
        data-testid="autocomplete-pill"
        className="flex flex-row items-center pl-5 border bg-hostinger-background-grey rounded-full focus-within:border-hostinger-purple hover:border-gray-800 transition-colors duration-300 mb-2"
      >
        <input
          data-testid="autocomplete-input-field"
          className="bg-inherit border-0 outline-0 grow text-base my-4"
          type="text"
          value={textInput}
          onChange={(event) => updateValue(event?.target?.value)}
        />
        <button
          data-testid="autocomplete-search-button"
          className={`rounded-full outline-none w-12 h-12 bg-hostinger-purple text-white my-0.5 ml-0.5 mr-1 hover:bg-hostinger-purple-deep ${
            isLoading ? LOADING_BUTTON_STYLING : SEARCH_BUTTON_STYLING
          }`}
          onClick={() => debouncedGetSuggestions(textInput)}
        >
          {isLoading ? null : ( //Issue with placement of svg when spinning.
            <img
              src={magnifyingGlass}
              alt="search"
              height={15}
              width={15}
              className={'mx-auto'}
              //className={`mx-auto ${isLoading ? 'animate-reverse-spin' : ''}`}
            />
          )}
        </button>
      </div>
      {suggestions && suggestions?.size > 0 ? (
        <SuggestionsList suggestions={suggestions} onSuggestionChosen={updateValue} />
      ) : null}
    </Fragment>
  );
};
