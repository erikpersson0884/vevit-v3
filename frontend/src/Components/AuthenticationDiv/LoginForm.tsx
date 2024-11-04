import { useState } from 'react';
import { useAuth } from '../../Contexts/AuthenticationContext';

interface LoginFormProps {
    openRegisterDiv: () => void;
    close: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ openRegisterDiv, close }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const [showError, setShowError] = useState(false);

    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowError(false);
        const success = await login(name, password);
        if (!success) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000);
        } else {
            close();
        }
    }
    
    return (
        <form className='authenticationForm' onSubmit={handleLogin}>
            <h2>Logga in</h2>
            <div className='inputDiv'></div>

            <div className='inputDiv'>
                <label htmlFor="name">Användarnamn:</label>
                <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
            </div>
            <div>
                <button onClick={handleLogin}>Log in</button>
                {showError ? <p className='errorMessage'>Wrong username or password</p> : null}
            </div>

            <button type="button" className='noButtonFormatting authenticationToggleButton' onClick={openRegisterDiv}>Dont have an account? <span>Create one</span></button>
        </form>
    )
};

export default LoginForm;