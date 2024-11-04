import React from 'react';
import { Vev } from '../types';


interface VevContextType {
  allVevs: Vev[];
  setAllVevs: React.Dispatch<React.SetStateAction<Vev[]>>;
}

export const VevContext = React.createContext<VevContextType | undefined>(undefined);

interface VevProviderProps {
  children: React.ReactNode;
}

export const VevProvider: React.FC<VevProviderProps> = ({ children }) => {
  const [allVevs, setAllVevs] = React.useState<Vev[]>([]);

  React.useEffect(() => {

    fetch('/api/vev/')
      .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
      })
      .then(data => {
        const users = data.map((vev: Vev) => {
          return {
            ...vev,
            time: new Date(vev.time),
          };
        });

        setAllVevs(users);
      })
      .catch(error => {
      console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <VevContext.Provider value={{ allVevs, setAllVevs}}>
      {children}
    </VevContext.Provider>
  );
};

export const useVevContext = () => {
  const context = React.useContext(VevContext);

  if (context === undefined) {
    throw new Error('useVevContext must be used within a VevProvider');
  }

  return context;
};