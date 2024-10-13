import './Footer.css';

const Footer = () => {
    return (
        <footer className="pageFooter">
            <p>Skapad med </p>
            <a href="https://wiki.chalmers.it/Pixeln" className='noAFormatting footerHearthLink'>
                <img src="images/pixelheart.png" alt="Pixel Heart" height={10} />
            </a>
            <p> av </p>
            <a href="https://github.com/erikpersson0884">Göken</a>
        </footer>
    );
} 

export default Footer;