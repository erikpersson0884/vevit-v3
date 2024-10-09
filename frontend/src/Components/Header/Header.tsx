import React from 'react';
import './Header.css';

import HeaderNavigation from './HeaderNavigation';

interface HeaderProps {
    openBookVev: () => void;
    openLogin: ()=> void;
}

const Header: React.FC<HeaderProps> = ({openBookVev, openLogin}) => {
    return (
        <header className="pageHeader">
            <img className="logo" src="/images/vevit-white.png" alt="vevIT Logo" />

            <HeaderNavigation openBookVev={openBookVev} openLogin={openLogin}/>
        </header>
    )
}

export default Header;