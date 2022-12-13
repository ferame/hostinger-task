import { AutocompleteSearch } from '../../components/autocomplete-search/AutocompleteSearch';

const SUGGESTIONS_LIMIT = 10;
const DEBOUNCE_TIME_MS = 1000;

export const WebsiteBuilder = () => {
  return (
    <div data-testid="website-builder" className="pt-10 flex flex-col items-center">
      <h1 className="pb-3 text-3.5xl px-2 text-center">What type of website are you building?</h1>
      <p className="pb-10 px-2 text-base text-hostinger-text-grey font-light text-center">
        Start typing and get the suggestions to choose from.
      </p>
      <div className="min-w-fit w-full max-w-sm px-2">
        <AutocompleteSearch suggestionsLimit={SUGGESTIONS_LIMIT} autocompleteDelayTimeMs={DEBOUNCE_TIME_MS} />
      </div>
    </div>
  );
};
