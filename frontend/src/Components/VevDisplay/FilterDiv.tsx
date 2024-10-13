import React from 'react';

import ToggleButton from '../ToggleButton/ToggleButton';

interface FilterDivProps {
    user: any;
    showAllVevs: boolean;
    setShowAllVevs: (showAllVevs: boolean) => void;
    showPastVevs: boolean;
    setShowPastVevs: (showPastVevs: boolean) => void;
}

const FilterDiv: React.FC<FilterDivProps> = ({user, showAllVevs, setShowAllVevs, showPastVevs, setShowPastVevs}) => {

    return (
        <div className='filterDiv'>
            {user && 
                <ToggleButton 
                    toggleFunction={() => {
                        setShowAllVevs(!showAllVevs);
                        localStorage.setItem('showAllVevs', JSON.stringify(!showAllVevs));
                    }} 
                    initialOption={showAllVevs ? 'Alla Vev' : 'Mina Vev'} 
                    option1='Alla Vev' 
                    // option2={`${user.name}'s Vev`} 
                    option2='Mina Vev'
                />
            }
            <ToggleButton 
                toggleFunction={() => {
                    setShowPastVevs(!showPastVevs);
                    localStorage.setItem('showPastVevs', JSON.stringify(!showPastVevs));
                    console.log(showPastVevs);
                }}
                initialOption={showPastVevs ? 'Passerade' : 'Kommande'} 
                option1='Kommande' 
                option2='Passerade' 
            />
        </div>
    )
}

export default FilterDiv;