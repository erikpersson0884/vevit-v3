import { useState } from 'react';
import { useAuth } from '../../Contexts/AuthenticationContext';

interface RegisterFormProps {
    openLoginForm: () => void;
    close: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ close, openLoginForm }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const { login } = useAuth();
    const VITE_API_URL = import.meta.env.VITE_API_URL;


    function register() {
        if (newPassword !== repeatPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch(`${VITE_API_URL}/people/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newUser: {
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
            console.log(data);
            login(data.adminKey, data.user);
            close();
        })
    }

    return (
        <form 
            className='authenticationForm' 
            onSubmit={(e) => e.preventDefault()} 
            onClick={(e) => e.stopPropagation()}
        >
            <h2>Register</h2>

            <div className='inputDiv'>
                <label htmlFor="username">Användarnamn:</label>
                <input type="text" id="username" name="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="repeatPassword">Upprepa Lösenord:</label>
                <input type="password" id="repeatPassword" name="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required></input>
            </div>

            <button onClick={register}>Register</button>

            <button type="button" className='noButtonFormatting authenticationToggleButton' onClick={openLoginForm}>Already have an account? <span>Log in</span></button>
        </form>
    )
}

export default RegisterForm;
