import React from "react";
import { useAuth } from '../../Contexts/AuthenticationContext';

interface AccountDivProps {
    openUserDiv: () => void;
}

const AccountDiv: React.FC<AccountDivProps> = ({ openUserDiv }) => {
    const { user, setUser } = useAuth();

    const [newUsername, setNewUsername] = React.useState(user?.name);
    const [newPassword, setNewPassword] = React.useState('');


    function updateUser() {
        if (!user) {
            alert('No user is signed in');
            return;
        }

        fetch(`/api/people`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    id: user.id,
                    name: newUsername,
                    password: newPassword
                }
            })
        })
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setUser(data.user);
            openUserDiv();
            console.log(data.user);
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
