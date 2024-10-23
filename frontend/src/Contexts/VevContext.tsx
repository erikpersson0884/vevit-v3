import React from 'react';

import { Vev } from '../types';

export const VevContext = React.createContext<Vev[]>([]);

interface VevProviderProps {
  children: React.ReactNode;
}

export const VevProvider: React.FC<VevProviderProps> = ({ children }) => {
  const [allVevs, setAllVevs] = React.useState<Vev[]>([]);

  React.useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/vev/')
        .then(res => res.json())
        .then(data => {
            setAllVevs(data);
    });
  }, []);

  return (
    <VevContext.Provider value={allVevs}>
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