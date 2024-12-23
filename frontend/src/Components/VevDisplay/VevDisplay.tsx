import React, { useState, useEffect } from 'react';
import './VevDisplay.css';
import { Vev } from '../../types';
import { useVevContext} from '../../Contexts/VevContext';
import { useAuth } from '../../Contexts/AuthenticationContext';

import VevLi from './VevLi';
import FilterDiv from './FilterDiv';


const VevDisplay: React.FC = () => {
    const {user} = useAuth();
    const {allVevs}: {allVevs: Vev[]} = useVevContext();

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
            
            <div className='table'>
                <header className='tableElement'>
                    <h2>Utmanare</h2>
                    <a className='noAFormatting' href='https://dtek.se/'>
                        <h2>Utmanad</h2>   
                    </a>
                    <h2>Tid</h2>
                    <h2>Anledning</h2>
                    {showPastVevs && !showAllVevs && <h2>Ställ in vinnare</h2>}
                </header>


                <div className='vevs'>
                    {filteredVevs.map((vev, index) => {
                        
                        return <VevLi className={`vev tableElement ${!(index % 2)? "colored" : ""}`} key={index} vev={vev} showPastVevs={showPastVevs} showAllVevs={showAllVevs} />
                    })}
                </div>
            </div>
        </div>
    );
}

export default VevDisplay;
