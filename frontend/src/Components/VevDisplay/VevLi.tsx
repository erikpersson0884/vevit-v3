

import React from 'react';

import { Vev } from '../../types';

interface VevProps {
    vev: Vev;
    showPastVevs: boolean;
    showAllVevs: boolean;
    className?: string;
}
const VevLi: React.FC<VevProps> = ({ vev, showPastVevs, showAllVevs, className }) => {
    const [winnerId, setWinnerId] = React.useState<string | null>(vev.winner ? vev.winner.id : null);

    // Synchronize winnerId with vev.winner when vev changes
    React.useEffect(() => {
        setWinnerId(vev.winner ? vev.winner.id : null);
    }, [vev.winner]);

    function handleUpdateVev() {
        if (winnerId !== vev.challenger.id && winnerId !== vev.challenged.id && winnerId !== null) {
            console.log('Invalid winner id');
            return;
        }

        fetch(import.meta.env.VITE_API_URL + '/vev/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                adminKey: localStorage.getItem('adminKey'),
                vev: vev,
                winnerId: winnerId,
            }),
        })
        .then((response) => {
            if (response.ok) {
                window.location.reload();
            }
        })
        .then((data) => {
            console.log(data);
        });
    }

    return (
        <div className={`${className} vev`}>
            <p>
                {vev.challenger.name}
                {(new Date(vev.time) < new Date() && vev.winner && vev.winner.id === vev.challenger.id) && (
                    <img src='images/crown.png' height={10} />
                )}
            </p>
            <p>
                {vev.challenged.name}
                {(new Date(vev.time) < new Date() && vev.winner && vev.winner.id === vev.challenged.id) && (
                    <img src='images/crown.png' height={10} />
                )}
            </p>
            <div>
                <p>
                    {new Date(vev.time).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </p>
                <p>
                    {new Date(vev.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <p className='vevReason'>{vev.reason}</p>

            {showPastVevs && !showAllVevs && (
                <div>
                    <select
                        className='setWinnerSelect'
                        value={winnerId ? winnerId : ''}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            setWinnerId(selectedValue ? selectedValue : null);
                        }}
                    >
                        <option key='challangerWinner' value=''>
                            Ingen
                        </option>
                        <option key='winner' value={vev.challenger.id}>
                            {vev.challenger.name}
                        </option>
                        <option key='challengedWinner' value={vev.challenged.id}>
                            {vev.challenged.name}
                        </option>
                    </select>
                    {(vev.winner === null && winnerId !== null) ||
                    (vev.winner && vev.winner.id !== winnerId) ? (
                        <button className='updateVevButton' onClick={handleUpdateVev}>
                            Uppdatera
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
};


export default VevLi;