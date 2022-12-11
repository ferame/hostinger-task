import { SuggestionsListEntry } from './SuggestionsListEntry';

interface ISuggestionsList {
  suggestions: Set<string>;
  onSuggestionChosen: (suggestion: string) => void;
}

const currentSelectionMock = 'Current Mock Selection';
const currentSelectionMockKey = 'potato-current-selection';

export const SuggestionsList: React.FC<ISuggestionsList> = ({ suggestions, onSuggestionChosen }) => {
  const listItems = [...suggestions].map((suggestion) => (
    <SuggestionsListEntry key={suggestion} text={suggestion} onClick={onSuggestionChosen} />
  ));
  return (
    <ul
      data-testid="suggestions-list"
      className="rounded-l-lg border shadow-md list-none max-h-48 overflow-y-auto pl-2 py-2 pr-2"
    >
      {listItems.length > 0 ? (
        <SuggestionsListEntry
          key={currentSelectionMockKey}
          text={currentSelectionMock}
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
