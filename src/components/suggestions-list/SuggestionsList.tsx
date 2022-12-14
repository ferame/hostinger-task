import { SuggestionsListEntry } from './SuggestionsListEntry';

interface ISuggestionsList {
  isApiClientCalled: boolean;
  currentInput: string;
  suggestions: Set<string>;
  onSuggestionChosen: (suggestion: string) => void;
}

export const SuggestionsList: React.FC<ISuggestionsList> = ({
  isApiClientCalled,
  currentInput,
  suggestions,
  onSuggestionChosen,
}) => {
  const listItems = [...suggestions].map((suggestion) => (
    <SuggestionsListEntry key={suggestion} text={suggestion} onClick={onSuggestionChosen} />
  ));

  const isInputPresent = currentInput.length > 0;
  const areSuggestionsPresent = listItems.length > 0;

  return (
    <ul
      data-testid="suggestions-list"
      className="rounded-l-lg border shadow-md list-none max-h-48 overflow-y-auto pl-2 py-2 pr-2 max-w-sm"
    >
      {isInputPresent ? (
        <div className="rounded-md bg-hostinger-hover-grey">
          <SuggestionsListEntry key={`current-input-text`} text={currentInput} onClick={onSuggestionChosen} />
        </div>
      ) : null}

      {isApiClientCalled || areSuggestionsPresent ? (
        <p className="text-3xs font-medium py-2 px-4 text-slate-800 tracking-2widest uppercase">Suggestions</p>
      ) : null}
      {isApiClientCalled && !areSuggestionsPresent ? (
        <p className="py-2 px-4 text-sm text-left font-normal">No suggestions found</p>
      ) : (
        listItems
      )}
    </ul>
  );
};
