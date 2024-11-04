import React from 'react';
import { User, Vev } from '../../types';

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

        fetch('/api/vev/', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
            adminKey: localStorage.getItem('adminKey'),
            vev: vev,
            winnerId: winnerId,
            }),
        })
        .then((response) => {
            if (response.status === 200) {
                window.location.reload();
            }
        })
        .then((data) => {
            console.log(data);
        });
    }

    function vevIsInPast() {
        return new Date(vev.time) < new Date();
    }

    function userIsWinner(user: User): boolean {
        return vev.winner ? vev.winner.id === user.id : false;
    }

    return (
        <div className={`${className} vev`}>
            <p>
                {vev.challenger? vev.challenger.name : 'Deleted User'}

                {(vevIsInPast() && userIsWinner(vev.challenger)) && (
                    <img src='images/crown.png' height={10} />
                )}
            </p>
            <p>
                {vev.challenged ? vev.challenged.name : 'Deleted User'}

                {(vevIsInPast() && userIsWinner(vev.challenged)) && (
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

            <WinnerElement 
                vev={vev}
                showPastVevs={showPastVevs}
                showAllVevs={showAllVevs}
                winnerId={winnerId}
                setWinnerId={setWinnerId}
                handleUpdateVev={handleUpdateVev}
            />
        </div>
    );
};


export default VevLi;


interface WinnerElementProps {
    vev: Vev;
    showPastVevs: boolean;
    showAllVevs: boolean;
    winnerId: string | null;
    setWinnerId: React.Dispatch<React.SetStateAction<string | null>>;
    handleUpdateVev: () => void;
}

const WinnerElement: React.FC<WinnerElementProps> = ({ vev, showPastVevs, showAllVevs, winnerId, setWinnerId, handleUpdateVev }) => {
    return (
        showPastVevs && !showAllVevs ?

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

        : 
        null
    );
};
