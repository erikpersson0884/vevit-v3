import React from 'react';
import './Header.css';

import HeaderNavigation from './HeaderNavigation';
import { Link } from 'react-router-dom';

interface HeaderProps {
    openBookVev: () => void;
    openLogin: ()=> void;
}

const Header: React.FC<HeaderProps> = ({openBookVev, openLogin}) => {
    return (
        <header className="pageHeader">
            <Link to="/" className='noAFormatting'>
                <img className="logo" src="/images/vevit-white.png" alt="vevIT Logo" />
            </Link>

            <HeaderNavigation openBookVev={openBookVev} openLogin={openLogin}/>
        </header>
    )
}

export default Header;