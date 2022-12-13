import magnifyingGlass from '../../assets/magnifying-glass.svg';

interface IAutocompleteButton {
  isLoading: boolean;
  onClick: (args: any) => void;
}

export const AutocompleteButton: React.FC<IAutocompleteButton> = ({ isLoading, onClick }) => {
  return isLoading ? (
    <button className="w-12 h-12 mr-1">
      <div className="z-10 absolute rounded-full h-9 w-9 bg-hostinger-purple outline-none ml-1.5 mt-1.5">
        <img src={magnifyingGlass} alt="search" height={16} width={16} className="mx-auto pt-2.5" />
      </div>
      <div className="z-0 rounded-full w-12 h-12 bg-gradient-to-tr from-indigo-500 to-pink-500 outline-none animate-spin"></div>
    </button>
  ) : (
    <button
      data-testid="autocomplete-search-button"
      className={`rounded-full outline-none w-12 h-12 bg-hostinger-purple text-white my-0.5 ml-0.5 mr-1 hover:bg-hostinger-purple-deep focus:border-2 focus:border-hostinger-purple-opaque`}
      onClick={onClick}
    >
      <img src={magnifyingGlass} alt="search" height={16} width={16} className={'mx-auto'} />
    </button>
  );
};
