import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import AuthenticationDiv from './Components/AuthenticationDiv/AuthenticationDiv';
import BookVevDiv from './Components/BookVevDiv/BookVevDiv';

import { AuthProvider } from './Contexts/AuthenticationContext'
import VevDisplay from './Components/VevDisplay/VevDisplay';

import AdminPage from './Components/AdminPage/AdminPage';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { VevProvider } from './Contexts/VevContext';
import { PeopleProvider } from './Contexts/PeopleContext';


function App() {
    const [showAuthenticationDiv, setShowAuthenticationDiv] = React.useState(false);
    const [showBookVev, setShowBookVev] = React.useState(false);

    return (
        <>
            <AuthProvider>
                <VevProvider>
                    <PeopleProvider>

                        <Header openBookVev={() => setShowBookVev(!showBookVev)} openLogin={() => setShowAuthenticationDiv(!showAuthenticationDiv)} />


                        <AuthenticationDiv showAuthenticationDiv={showAuthenticationDiv} closeAuthenticationDiv={() => setShowAuthenticationDiv(false)} />
                        <BookVevDiv showBookVev={showBookVev} closeBookVevDiv={() =>setShowBookVev(false)} />

                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<VevDisplay />} />
                                <Route path="/adminPage" element={<AdminPage />} />
                            </Routes>
                        </BrowserRouter>

                        <Footer />
                    </PeopleProvider>
                </VevProvider>
            </AuthProvider>
        </>
    )
}

export default App
