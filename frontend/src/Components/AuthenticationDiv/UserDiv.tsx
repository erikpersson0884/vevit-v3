import React from 'react';
import { useAuth } from '../../Contexts/AuthenticationContext';

import { useVevContext } from "../../Contexts/VevContext";
import { getUserStats } from "../../Util/stats";

interface UserDivProps {
    openAccountDiv: () => void;
}

const UserDiv: React.FC<UserDivProps> = ({openAccountDiv}) => {
    const { isAuthenticated, user, logout } = useAuth();
    const { allVevs } = useVevContext();


    let userStats;
    user? userStats = getUserStats(user, allVevs) : userStats = {numberOfVevs: 0, numberOfVevsWon: 0, numberOfVevsLost: 0, winPercentage: 0};


    return (
        isAuthenticated && user ?
        <div className='userDiv authenticationForm'>
            <h2>{user.name}</h2>

            <ul className='noUlFormatting userStatsList'>
                <li>Number of vevs: {userStats.numberOfVevs}</li>
                <li>Number of wins: {userStats.numberOfVevsWon}</li>
                <li>Number of losses: {userStats.numberOfVevsLost}</li>
                <li>Win percentage: {userStats.winPercentage}%</li>
            </ul>


            <button onClick={openAccountDiv}>Hantera Konto</button>
            <button onClick={logout}>Logga ut</button>
        </div>
        :
        <p>Something went wrong, user was not found...</p>
    );
}

export default UserDiv;
