interface ISuggestionsListEntry {
  text: string;
  onClick: Function;
}

export const SuggestionsListEntry: React.FC<ISuggestionsListEntry> = ({ text, onClick }) => {
  return (
    <li className="rounded-md hover:bg-hostinger-hover-grey py-2 px-4" onClick={() => onClick(text)}>
      <p className="text-sm font-normal">{text}</p>
    </li>
  );
};
