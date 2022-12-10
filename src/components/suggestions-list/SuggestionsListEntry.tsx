interface ISuggestionsListEntry {
    text: string,
    onClick: Function
}

const SuggestionsListEntry: React.FC<ISuggestionsListEntry> = ({text, onClick}) => {
    return (
        <li className="rounded-md hover:bg-hostinger-hover-grey" onClick={() => onClick(text)}>
          <p>{text}</p>
        </li>
    );
}

export default SuggestionsListEntry;