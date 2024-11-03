import React from 'react';

import { User } from '../types';

interface PeopleContextType {
    allPeople: User[];
    setAllPeople: React.Dispatch<React.SetStateAction<User[]>>;
}

export const PeopleContext = React.createContext<PeopleContextType | undefined>(undefined);

interface PeopleProviderProps {
    children: React.ReactNode;
}

export const PeopleProvider: React.FC<PeopleProviderProps> = ({ children }) => {
    const [allPeople, setAllPeople] = React.useState<User[]>([]);

    React.useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/people/')
                .then(res => res.json())
                .then(data => {
                        setAllPeople(data);
        });
    }, []);

    return (
        <PeopleContext.Provider value={{ allPeople, setAllPeople }}>
            {children}
        </PeopleContext.Provider>
    );
};

export const usePeopleContext = () => {
    const context = React.useContext(PeopleContext);

    if (context === undefined) {
        throw new Error('usePeopleContext must be used within a PeopleProvider');
    }

    return context;
};