import { SuggestionsListEntry } from './SuggestionsListEntry';

interface ISuggestionsList {
  currentInput: string;
  suggestions: Set<string>;
  onSuggestionChosen: (suggestion: string) => void;
}

export const SuggestionsList: React.FC<ISuggestionsList> = ({ currentInput, suggestions, onSuggestionChosen }) => {
  const listItems = [...suggestions].map((suggestion) => (
    <SuggestionsListEntry key={suggestion} text={suggestion} onClick={onSuggestionChosen} />
  ));
  return (
    <ul className="rounded-l-lg border shadow-md list-none max-h-48 overflow-y-auto pl-2 py-2 pr-2">
      {currentInput.length > 0 ? (
        <SuggestionsListEntry
          key={`current-input-text`}
          text={currentInput}
          onClick={() => console.log('Current selection clicked')}
        />
      ) : null}
      {listItems.length > 0 ? (
        <p className="text-3xs font-medium py-2 px-4 text-slate-800 tracking-2widest uppercase">Suggestions</p>
      ) : null}
      {listItems}
    </ul>
  );
};
