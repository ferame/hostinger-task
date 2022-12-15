import { Fragment, useCallback, useState } from 'react';
import { suggestionsApiClient } from '../../api/suggestionsApiClient';
import { SuggestionsList } from '../../components/suggestions-list/SuggestionsList';
import { debounce } from '../../utils/debounce';
import { AutocompleteButton } from '../autocomplete-button/AutocompleteButton';

interface IAutocompleteSearch {
  suggestionsLimit: number;
  autocompleteDelayTimeMs: number;
}

export const AutocompleteSearch: React.FC<IAutocompleteSearch> = ({ suggestionsLimit, autocompleteDelayTimeMs }) => {
  const [textInput, setTextInput] = useState('');
  const [suggestions, setSuggestions] = useState(new Set<string>());
  const [isLoading, setIsLoading] = useState(false);
  const [isApiClientCalled, setIsApiClientCalled] = useState(false);

  const getSuggestions = useCallback(async (input: string) => {
    setIsLoading(true);

    const retrievedSuggestions = await suggestionsApiClient.suggestionsPostRequest(input, suggestionsLimit);
    if (retrievedSuggestions.length > 0) setSuggestions(new Set(retrievedSuggestions));

    setIsLoading(false);
    setIsApiClientCalled(true);
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
        className="flex flex-row items-center pl-5 border bg-hostinger-background-grey rounded-full focus-within:border-hostinger-purple hover:border-gray-800 transition-colors duration-300 mb-2 w-full max-w-sm"
      >
        <input
          data-testid="autocomplete-input-field"
          className="bg-inherit border-0 outline-0 grow text-base my-4 truncate"
          type="text"
          placeholder="Type here to search"
          value={textInput}
          onChange={(event) => updateValue(event.target?.value ?? '')}
        />
        <AutocompleteButton isLoading={isLoading} onClick={() => debouncedGetSuggestions(textInput)} />
      </div>
      {isApiClientCalled || textInput.length > 0 ? (
        <SuggestionsList
          isApiClientCalled={isApiClientCalled}
          currentInput={textInput}
          suggestions={suggestions}
          onSuggestionChosen={updateValue}
        />
      ) : null}
    </Fragment>
  );
};
