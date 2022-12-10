import SuggestionsListEntry from "./SuggestionsListEntry"

interface ISuggestionsList {
    suggestions: Set<string>,
    onSuggestionChosen: (suggestion: string) => void
}

const SuggestionsList: React.FC<ISuggestionsList> = ({ suggestions, onSuggestionChosen }) => {
    const listItems = [...suggestions].map(suggestion =>
        <SuggestionsListEntry key={suggestion} text={suggestion} onClick={onSuggestionChosen}/>
    );
    return (
        <ul className="rounded-l-lg border shadow-md list-none max-h-48 overflow-y-auto pl-2 py-2 pr-2">
            {listItems}
        </ul>
    )
};

export default SuggestionsList;