interface ISuggestionsListEntry {
  text: string;
  onClick: (text: string) => void;
}

export const SuggestionsListEntry: React.FC<ISuggestionsListEntry> = ({ text, onClick }) => {
  return (
    <li className="rounded-md hover:bg-hostinger-hover-grey focus-within:bg-hostinger-hover-grey">
      <button className="w-full h-full outline-none py-2 px-4" onClick={() => onClick(text)}>
        <p className="text-sm text-left font-normal">{text}</p>
      </button>
    </li>
  );
};
