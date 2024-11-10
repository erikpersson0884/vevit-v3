import React from 'react';
import './BookVevDiv.css';

import { useAuth } from '../../Contexts/AuthenticationContext';
import { User } from '../../types';

interface BookVevDivProps {
    showBookVev: boolean;
    closeBookVevDiv: () => void;
}

const BookVevDiv: React.FC<BookVevDivProps> = ({showBookVev, closeBookVevDiv}) => {
    const { user } = useAuth();
    const [allUsers, setAllUsers] = React.useState<User[]>([]);

    React.useEffect(() => {
        fetch('/api/people/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setAllUsers(data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);

    const [challanged , setChallanged] = React.useState<User | null>(null);
    const [date, setDate] = React.useState<Date | null>(null);
    const [time, setTime] = React.useState<Date | null>(null);
    const [reason, setReason] = React.useState<string>('');

    function bookVev(e: React.FormEvent) {
        e.preventDefault();

        if (challanged === null || date === null || time === null) {
            console.log('Missing fields');
            console.log(challanged, date, time);
            return;
        }

        if (challanged.id === user?.id) {
            alert('Cannot challenge yourself');
            return;
        }

        const dateAndTime: Date = new Date(date);
        dateAndTime.setHours(time.getHours());
        dateAndTime.setMinutes(time.getMinutes());

        const newVev = {
            challenger: user,
            challenged: challanged,
            time: dateAndTime,
            reason: reason
        }

        fetch('/api/vev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ newVev: newVev })
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('There was an error booking the vev!', error);
        });
    }

    return (
        (showBookVev) ?
        <div className='shadowBox' onClick={closeBookVevDiv}>
            <form 
                className='popupWindow bookVevDiv' 
                onSubmit={(event) => bookVev(event)} 
                onClick={(e) => e.stopPropagation()}
            >
                <button className='closeButton' onClick={closeBookVevDiv}>X</button>

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
                        <option value={undefined}>Välj Motståndare</option>
                        {allUsers
                            .filter(u => u.id !== user?.id)
                            .map(filteredUser => (
                                <option key={filteredUser.id} value={filteredUser.id}>{filteredUser.name}</option>
                        ))}
                    </select>
                    </div>

                    <div className='inputDiv'>
                        <label htmlFor="date">Tid:</label>
                        <input 
                            type="date" 
                            id="date" 
                            onChange={(e) => setDate(new Date(e.target.value))} 
                        />

                        <input 
                            type="time" 
                            id="time" 
                            onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newTime = new Date();
                                newTime.setHours(hours, minutes);
                                setTime(newTime);
                            }}
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