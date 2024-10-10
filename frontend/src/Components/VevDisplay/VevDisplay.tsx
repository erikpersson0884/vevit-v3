import React, { useState, useEffect } from 'react';
import './VevDisplay.css';
import { Vev, User } from '../../types';

import ToggleButton from '../ToggleButton/ToggleButton';

interface VevDisplayProps {
    user: User | null;
}

const VevDisplay: React.FC<VevDisplayProps> = ({ user }) => {

    const [allVevs, setAllVevs] = useState<Vev[]>([]);
    const [filteredVevs, setFilteredVevs] = useState<Vev[]>([]);
    const [showAllVevs, setShowAllVevs] = useState(true);
    const [showPastVevs, setShowPastVevs] = useState(false);

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
        })

    }, []);

    return (
        <div className='vevDisplay'>
            <div className='filterDiv'>
                {user && <ToggleButton toggleFunction={() => setShowAllVevs(!showAllVevs)} option1='All Vev' option2='My Vev' />}
                <ToggleButton toggleFunction={() => setShowPastVevs(!showPastVevs)} option1='Kommande' option2='Passerade' />
            </div>

            <div className='vev'>
                <h2>Utmanare</h2>
                <h2>Utmanad</h2>
                <h2>Tid</h2>
            </div>

            <hr />

            <div className='vevs'>
                {filteredVevs.map(vev => {
                    return (
                        <div className='vev' key={vev.id}>
                            <p>
                                {vev.challenger.name} {( new Date(vev.time) < new Date() && vev.winner && vev.winner.id == vev.challenger.id ) 
                                && 
                                <img src='images/crown.png' height={10} />}
                            </p>
                            <p>
                                {vev.challenged.name} {( new Date(vev.time) < new Date() && vev.winner && vev.winner.id == vev.challenged.id) 
                                && 
                                <img src='images/crown.png' height={10} />}
                            </p>
                            <p>{new Date(vev.time).toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default VevDisplay;
