import React from 'react';
import './BookVevDiv.css';

import { User } from '../../types';

interface BookVevDivProps {
    showBookVev: boolean;
    closeBookVevDiv: () => void;
    user: User | null;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;


const BookVevDiv: React.FC<BookVevDivProps> = ({showBookVev, closeBookVevDiv, user}) => {

    const [allUsers, setAllUsers] = React.useState<User[]>([]);

    React.useEffect(() => {
        fetch(`${VITE_API_URL}/people/`
        )
        .then(response => response.json())
        .then(data => {
            setAllUsers(data);
        })
    }, []);

    const [challanged , setChallanged] = React.useState<User | null>(null);
    const [time, setTime] = React.useState<Date | null>(null);
    const [reason, setReason] = React.useState<string>('');

    function bookVev(e: React.FormEvent) {
        e.preventDefault();

        if (time === null || challanged === null) {
            return;
        }

        if (challanged === null) {
            return;
        }

        const newVev = {
            challenger: user,
            challenged: challanged,
            time: time,
            reason: reason
        }

        fetch(`${VITE_API_URL}/vev/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminKey: localStorage.getItem('adminKey'),
                newVev: newVev
            })
        })
        .then(response => {
            if (response.ok) {
                closeBookVevDiv();
            } else {
                throw new Error('Network response was not ok');
            }
        })
    }

    return (
        (showBookVev) ?
        <div className='shadowBox' onClick={closeBookVevDiv}>
            <form className='popupWindow bookVevDiv' onSubmit={(event) => bookVev(event)} onClick={(e) => e.stopPropagation()}>
                {user ? (
                <>
                    <h2>Boka vev</h2>

                    <div className='inputDiv'>
                    <p>Utmanare:</p>
                    <p>{user.name}</p>
                    </div>

                    <div className='inputDiv'>
                    <label htmlFor="challenged">Utmana:</label>
                    <select onChange={(e) => setChallanged(allUsers.find(user => user.id === e.target.value) || null)}>
                        <option value="">Välj en person</option>
                        {allUsers.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    </div>

                    <div className='inputDiv'>
                    <label htmlFor="date">Datum:</label>
                    <input 
                        type="date" 
                        id="date" 
                        onChange={(e) => setTime(new Date(e.target.value))} 
                    />
                    </div>

                    <div className='inputDiv'>
                    <label htmlFor="vevReasonTextarea">Anledning:</label>
                    <textarea 
                        id="vevReasonTextarea" 
                        placeholder='Anledning...' 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                    </div>

                    <button type="submit">Boka vev</button>
                </>
                ) : (
                <h2>Du måste vara inloggad för att boka en vev</h2>
                )}
            </form>
        </div>
        :
        null
    )
};

export default BookVevDiv;