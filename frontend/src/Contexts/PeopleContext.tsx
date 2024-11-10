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

        fetch('/api/people/')
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            })
            .then(data => {
                const people: User[] = data.map((person: User) => {
                    return {
                        ...person,
                        createdAt: person.createdAt ? new Date(person.createdAt) : undefined,
                    };
                });
            setAllPeople(people);
            })
            .catch(error => {
            console.error('Error fetching people:', error);
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