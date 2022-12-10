import { Fragment, useEffect, useState, useCallback } from 'react';
import debounce from '../../utils/debounce';
import SuggestionsList from '../../components/suggestions-list/SuggestionsList';
import magnifyingGlass from '../../assets/magnifying-glass.svg';

const SUGGESTIONS_LIMIT = 10;

const suggestionsApiService = async (input: string, limit: number): Promise<string[]> => {
    const requestOptions: RequestInit = {
        method: 'POST',
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            input: input,
            limit: limit
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
        console.log(`Error: ${error}`);
        return [];
    }
};

// TODO: this component can be made into reusable autocomplete component and into separate WebsiteBuilder component
const WebsiteBuilder = () => {
    const [textInput, setTextInput] = useState<string>(''); //TODO: might be able to useRef instead, re-https://youtu.be/GGo3MVBFr1A?t=110
    const [suggestions, setSuggestions] = useState<Set<string>>(new Set());

    const getSuggestions = useCallback(async (input: string) => {
        const retrievedSuggestions = await suggestionsApiService(input, SUGGESTIONS_LIMIT); 
        setSuggestions(new Set(retrievedSuggestions));
    }, []);

    const debouncedGetSuggestions = useCallback(debounce((input: string) => getSuggestions(input), 1000), []);

    const updateValue = (newInput: string) => {
		setTextInput(newInput);
		debouncedGetSuggestions(newInput);
	};

    const getSuggestionsOnButtonClick = () => {
        if (textInput.length > 0)
            debouncedGetSuggestions(textInput);
    };
    // TODO: in outer div, add styling so that it does make SuggestionsList and the purple pill same width

    return (
        <div>
            <h1>What type of website are you building?</h1>
            <p>Start typing and get the suggestions to choose from.</p>
            <div className='w-96'>
                <div className='flex flex-row pl-5 border bg-hostinger-background-grey rounded-full focus-within:border-hostinger-purple hover:border-gray-800 transition-colors duration-300'>
                    <input className='bg-inherit outline-0 grow' type="text" value={textInput} onChange={event => updateValue(event?.target?.value)}/>
                    <button 
                        className='rounded-full outline-none bg-hostinger-purple hover:bg-hostinger-purple-deep text-white my-0.5 mx-0.5 w-10 h-10 focus:border-2 focus:border-hostinger-purple-opaque'
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

export default WebsiteBuilder;