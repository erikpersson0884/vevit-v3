import React, { useState, useEffect } from 'react';
import './VevDisplay.css';
import { Vev, User } from '../../types';

import ToggleButton from '../ToggleButton/ToggleButton';

interface VevDisplayProps {
    user: User;
}

const VevDisplay: React.FC<VevDisplayProps> = ({ user }) => {

    const [allVevs, setAllVevs] = useState<Vev[]>([]);
    const [filteredVevs, setFilteredVevs] = useState<Vev[]>([]);
    const [showAllVevs, setShowAllVevs] = useState(true);
    const [showPastVevs, setShowPastVevs] = useState(false);

    useEffect(() => {
        const mockData: Vev[] = [
            { id: "1", challenger: 'Alice', challenged: 'Bob', time: '2023-10-01 10:00', reason: "f", winner: null },
            { id: "2", challenger: 'Charlie', challenged: 'Dave', time: '2023-10-02 11:00', reason: "f", winner: null },
            { id: "3", challenger: 'Eve', challenged: 'Frank', time: '2023-10-03 12:00', reason: "f", winner: null },
        ];
        setAllVevs(mockData);
        setFilteredVevs(mockData);
    }, []);

    useEffect(() => {
        if (showAllVevs) {
            setFilteredVevs(allVevs);
        } else {
            setFilteredVevs(allVevs.filter(vev => vev.challenger === user.name || vev.challenged === user.name));
        }
    }, [showAllVevs, allVevs, user.name]);

    useEffect(() => {
        if (showPastVevs) {
            setFilteredVevs(allVevs.filter(vev => new Date(vev.time) < new Date()));
        } else {
            setFilteredVevs(allVevs.filter(vev => new Date(vev.time) >= new Date()));
        }
    }, [showPastVevs, allVevs]);

    return (
        <div className='vevDisplay'>
            <div className='filterDiv'>
                <ToggleButton toggleFunction={() => setShowAllVevs(!showAllVevs)} option1='All Vev' option2='My Vev' />
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
                            <p>{vev.challenger}</p>
                            <p>{vev.challenged}</p>
                            <p>{vev.time}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default VevDisplay;
