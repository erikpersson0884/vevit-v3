import React, { useState, useEffect } from 'react';
import './VevDisplay.css';
import { Vev, User } from '../../types';
import { useVevContext} from '../../Contexts/VevContext';

import VevLi from './VevLi';
import FilterDiv from './FilterDiv';


interface VevDisplayProps {
    user: User | null;
}

const VevDisplay: React.FC<VevDisplayProps> = ({ user }) => {
    const allVevs: Vev[] = useVevContext();

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



    return (
        <div className='vevDisplay'>
            <FilterDiv user={user} showAllVevs={showAllVevs} setShowAllVevs={setShowAllVevs} showPastVevs={showPastVevs} setShowPastVevs={setShowPastVevs} />
            
            <div>
                <div className='vev vevsHeader'>
                    <h2>Utmanare</h2>
                    <a className='noAFormatting' href='https://dtek.se/'>
                        <h2>Utmanad</h2>   
                    </a>
                    <h2>Tid</h2>
                    <h2>Anledning</h2>
                    {showPastVevs && !showAllVevs && <h2>Ställ in vinnare</h2>}
                </div>


                <div className='vevs'>
                    {filteredVevs.map((vev, index) => {
                        
                        return <VevLi className={!(index % 2)? "coloredVev" : ""} key={index} vev={vev} showPastVevs={showPastVevs} showAllVevs={showAllVevs} />
                    })}
                </div>
            </div>
        </div>
    );
}

export default VevDisplay;
