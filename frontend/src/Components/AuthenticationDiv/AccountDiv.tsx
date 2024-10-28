import React from "react";
import { useAuth } from '../../Contexts/AuthenticationContext';

interface AccountDivProps {
    openUserDiv: () => void;
}

const AccountDiv: React.FC<AccountDivProps> = ({ openUserDiv }) => {
    const { user, setUser } = useAuth();

    const [newUsername, setNewUsername] = React.useState(user?.name);
    const [newPassword, setNewPassword] = React.useState('');

    const VITE_API_URL = import.meta.env.VITE_API_URL;

    function updateUser() {
        fetch(`${VITE_API_URL}/people/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminKey: localStorage.getItem('adminKey'),
                user: {
                    name: newUsername,
                    password: newPassword
                }
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUser(data.user);
                openUserDiv();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    return (
        <>
            <h2>Konto-uppgifter</h2>

            <div className='inputDiv'>
                <label htmlFor="username">Användarnamn:</label>
                <input type="text" id="username" name="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required></input>
            </div>
            <div className="actionButtons">
                <button onClick={updateUser}>Update</button>
                <button onClick={openUserDiv}>Cancel</button>
            </div>
        </>
    );
};

export default AccountDiv;
