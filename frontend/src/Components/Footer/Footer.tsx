import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="pageFooter">
            <p>Skapad med </p>
            <img src="images/pixelheart.png" alt="Pixel Heart" height={10} />
            <p> av </p>
            <a href="https://github.com/erikpersson0884">Göken</a>
        </footer>
    );
} 

export default Footer;