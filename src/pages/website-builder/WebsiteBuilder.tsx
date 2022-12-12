import { AutocompleteSearch } from '../../components/autocomplete-search/AutocompleteSearch';

const SUGGESTIONS_LIMIT = 10;
const DEBOUNCE_TIME_MS = 1000;

// TODO: this component can be made into reusable autocomplete component and into separate WebsiteBuilder component
export const WebsiteBuilder = () => {
  return (
    <div data-testid="website-builder" className="pt-10 flex flex-col items-center">
      <h1 className="pb-3 text-3.5xl">What type of website are you building?</h1>
      <p className="pb-10 text-base text-hostinger-text-grey font-light">
        Start typing and get the suggestions to choose from.
      </p>
      <div className="w-96">
        <AutocompleteSearch suggestionsLimit={SUGGESTIONS_LIMIT} autocompleteDelayTimeMs={DEBOUNCE_TIME_MS} />
      </div>
    </div>
  );
};
