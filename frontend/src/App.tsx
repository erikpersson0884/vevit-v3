import React from 'react'
import './App.css'

import { User } from './types'

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

    const [user, setUser] = React.useState<User | null>(null);

    return (
        <>
            <AuthProvider setUser={setUser}>
                <VevProvider>

                    <Header openBookVev={() => setShowBookVev(!showBookVev)} openLogin={() => setShowAuthenticationDiv(!showAuthenticationDiv)} />


                    <AuthenticationDiv showAuthenticationDiv={showAuthenticationDiv} closeAuthenticationDiv={() => setShowAuthenticationDiv(false)} />
                    <BookVevDiv showBookVev={showBookVev} user={user} closeBookVevDiv={() =>setShowBookVev(false)} />

                    <VevDisplay user={user}/>

                    <Footer />
                </VevProvider>
            </AuthProvider>
        </>
    )
}

export default App
