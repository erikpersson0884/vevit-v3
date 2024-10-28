import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import AuthenticationDiv from './Components/AuthenticationDiv/AuthenticationDiv';
import BookVevDiv from './Components/BookVevDiv/BookVevDiv';

import { AuthProvider } from './Contexts/AuthenticationContext'
import VevDisplay from './Components/VevDisplay/VevDisplay';

import { VevProvider } from './Contexts/VevContext';


function App() {
    const [showAuthenticationDiv, setShowAuthenticationDiv] = React.useState(false);
    const [showBookVev, setShowBookVev] = React.useState(false);

    return (
        <>
            <AuthProvider>
                <VevProvider>

                    <Header openBookVev={() => setShowBookVev(!showBookVev)} openLogin={() => setShowAuthenticationDiv(!showAuthenticationDiv)} />


                    <AuthenticationDiv showAuthenticationDiv={showAuthenticationDiv} closeAuthenticationDiv={() => setShowAuthenticationDiv(false)} />
                    <BookVevDiv showBookVev={showBookVev} closeBookVevDiv={() =>setShowBookVev(false)} />

                    <VevDisplay/>

                    <Footer />
                </VevProvider>
            </AuthProvider>
        </>
    )
}

export default App
