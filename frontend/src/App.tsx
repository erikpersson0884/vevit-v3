import React from 'react'
import './App.css'

import { User } from './types'

import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import AuthenticationDiv from './Components/AuthenticationDiv/AuthenticationDiv';
import BookVevDiv from './Components/BookVevDiv/BookVevDiv';

import { AuthProvider } from './AuthenticationContext'
import VevDisplay from './Components/VevDisplay/VevDisplay';


function App() {

    const [showAuthenticationDiv, setShowAuthenticationDiv] = React.useState(false);
    const [showBookVev, setShowBookVev] = React.useState(false);

    const [user, setUser] = React.useState<User>({
        name: 'Alice',
        id: "1"
    });

    return (
        <>
            <AuthProvider>

                <Header openBookVev={() => setShowBookVev(!showBookVev)} openLogin={() => setShowAuthenticationDiv(!showAuthenticationDiv)} />


                <AuthenticationDiv showAuthenticationDiv={showAuthenticationDiv} />
                <BookVevDiv showBookVev={showBookVev} user={user} />

                <VevDisplay user={user}/>

                <Footer />

            </AuthProvider>
        </>
    )
}

export default App
