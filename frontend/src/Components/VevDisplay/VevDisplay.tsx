import React, { useState, useEffect } from 'react';
import './VevDisplay.css';
import { Vev, User } from '../../types';

import ToggleButton from '../ToggleButton/ToggleButton';
import VevLi from './VevLi';

interface VevDisplayProps {
    user: User | null;
}

const VevDisplay: React.FC<VevDisplayProps> = ({ user }) => {

    const [allVevs, setAllVevs] = useState<Vev[]>([]);
    const [filteredVevs, setFilteredVevs] = useState<Vev[]>([]);
    
    const savedShowAllVevs = localStorage.getItem('showAllVevs');
    const savedShowPastVevs = localStorage.getItem('showPastVevs');
    
    const [showAllVevs, setShowAllVevs] = useState<boolean>(savedShowAllVevs !== null ? JSON.parse(savedShowAllVevs) : true);
    const [showPastVevs, setShowPastVevs] = useState<boolean>(savedShowPastVevs !== null ? JSON.parse(savedShowPastVevs) : false);


    useEffect(() => {
        let filtered = allVevs;

        if (user && !showAllVevs) {
            filtered = filtered.filter(vev => vev.challenger.name === user.name || vev.challenged.name === user.name);
        }

        if (showPastVevs) {
            filtered = filtered.filter(vev => new Date(vev.time) < new Date());
        } else {
            filtered = filtered.filter(vev => new Date(vev.time) >= new Date());
        }

        setFilteredVevs(filtered);
    }, [showAllVevs, showPastVevs, allVevs, user]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/vev/')
            .then(res => res.json())
            .then(data => {
                setAllVevs(data);
        });
    }, []);

    

    return (
        <div className='vevDisplay'>
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

            <div className='vev vevsHeader'>
                <h2>Utmanare</h2>
                <h2>
                    <a className='noAFormatting' href='https://dtek.se/'>
                    Utmanad
                    </a>
                </h2>
                <h2>Tid</h2>
                <h2>Anledning</h2>
                {showPastVevs && !showAllVevs && <h2>Ställ in vinnare</h2>}
            </div>

            {/* <hr /> */}

            <div className='vevs'>
                {filteredVevs.map((vev, index) => {
                    return <VevLi key={index} vev={vev} showPastVevs={showPastVevs} showAllVevs={showAllVevs} />
                })}
            </div>
        </div>
    );
}

export default VevDisplay;
