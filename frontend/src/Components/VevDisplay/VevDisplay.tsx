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
        if (user) {
            if (!showAllVevs) {
                setFilteredVevs(allVevs.filter(vev => vev.challenger.name === user.name || vev.challenged.name === user.name));
            } else {
                setFilteredVevs(allVevs);
            }
        } else {
            setFilteredVevs(allVevs);
        }
    }, [showAllVevs, allVevs, user]);

    useEffect(() => {
        if (showPastVevs) {
            setFilteredVevs(allVevs.filter(vev => new Date(vev.time) < new Date()));
        } else {
            setFilteredVevs(allVevs.filter(vev => new Date(vev.time) >= new Date()));
        }
    }, [showPastVevs, allVevs]);

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
                            <p>{vev.challenger.name}</p>
                            <p>{vev.challenged.name}</p>
                            <p>{new Date(vev.time).toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default VevDisplay;
