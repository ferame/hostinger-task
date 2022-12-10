import { useState, useCallback } from 'react';
import { debounce } from '../../utils/debounce';
import { SuggestionsList } from '../../components/suggestions-list/SuggestionsList';
import magnifyingGlass from '../../assets/magnifying-glass.svg';

const SUGGESTIONS_LIMIT = 10;
const DEBOUNCE_TIME_MS = 1000;

const suggestionsApiService = async (input: string, limit: number): Promise<string[]> => {
    const requestOptions: RequestInit = {
        method: 'POST',
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            input,
            limit,
        })
    };

    try {
        const response = await fetch(`https://ai-qa-wizard-text-similarity-dev-yls6dto53q-uc.a.run.app/inference`, requestOptions);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const suggestions = await response.json();
        return suggestions;
    } catch (error) {
        console.error(`Error: ${error}`);
        return [];
    }
};

// TODO: this component can be made into reusable autocomplete component and into separate WebsiteBuilder component
export const WebsiteBuilder = () => {
    const [textInput, setTextInput] = useState('');
    const [suggestions, setSuggestions] = useState(new Set<string>());

    const getSuggestions = useCallback(async (input: string) => {
        const retrievedSuggestions = await suggestionsApiService(input, SUGGESTIONS_LIMIT); 
        setSuggestions(new Set(retrievedSuggestions));
    }, []);

    const debouncedGetSuggestions = useCallback(debounce((input: string) => getSuggestions(input), DEBOUNCE_TIME_MS), []);

    const updateValue = (newInput: string) => {
		setTextInput(newInput);
		debouncedGetSuggestions(newInput);
	};

    const getSuggestionsOnButtonClick = () => {
        if (textInput.length > 0)
            debouncedGetSuggestions(textInput);
    };

    return (
        <div className='pt-10 flex flex-col items-center'>
            <h1 className='pb-3 text-3.5xl'>What type of website are you building?</h1>
            <p className='pb-10 text-base text-hostinger-text-grey font-light'>Start typing and get the suggestions to choose from.</p>
            <div className='w-96'>
                <div className='flex flex-row items-center pl-5 border bg-hostinger-background-grey rounded-full focus-within:border-hostinger-purple hover:border-gray-800 transition-colors duration-300 mb-2'>
                    <input className='bg-inherit border-0 outline-0 grow text-base my-4' type="text" value={textInput} onChange={event => updateValue(event?.target?.value)}/>
                    <button 
                        className='rounded-full outline-none bg-hostinger-purple hover:bg-hostinger-purple-deep text-white my-0.5 ml-0.5 mr-1 w-12 h-12 focus:border-2 focus:border-hostinger-purple-opaque'
                        onClick={getSuggestionsOnButtonClick}
                    >
                        <img src={magnifyingGlass} alt='search' height={15} width={15} className='mx-auto'/>
                    </button>
                </div>
                {suggestions && suggestions?.size > 0 ? <SuggestionsList suggestions={suggestions} onSuggestionChosen={updateValue}/> : null}
            </div>
        </div>
    );
};