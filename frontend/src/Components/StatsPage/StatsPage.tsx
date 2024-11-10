import "./StatsPage.css";
import { useState } from "react";
import { usePeopleContext } from "../../Contexts/PeopleContext";
import { useVevContext } from "../../Contexts/VevContext";
import { getUserStats } from "../../Util/stats";
import { userStats } from "../../types";
import PopupDiv from "../PopupDiv/PopupDiv";

type SortKey = "user.name" | "numberOfVevs" | "numberOfVevsWon" | "numberOfVevsLost" | "winPercentage";

const StatsPage = () => {
    const { allPeople } = usePeopleContext();
    const { allVevs } = useVevContext();

    const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'ascending' | 'descending' }>({ key: 'user.name', direction: 'ascending' });

    const allPeopleStats: userStats[] = allPeople.map(person => {
        return getUserStats(person, allVevs);
    });

    const sortedPeopleStats = [...allPeopleStats];
    if (sortConfig !== null) {
        sortedPeopleStats.sort((a, b) => {
            const aValue = sortConfig.key.includes("user.") ? a.user[sortConfig.key.split(".")[1] as keyof typeof a.user] : a[sortConfig.key as keyof userStats];

            const bValue = sortConfig.key.includes("user.") ? b.user[sortConfig.key.split(".")[1] as keyof typeof b.user] : b[sortConfig.key as keyof userStats];
            
            if (aValue !== undefined && bValue !== undefined) {
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <ul className="statsPage table noUlFormatting">
            <header className="tableElement">
                <h3 onClick={() => requestSort('user.name')}>
                    {sortConfig.key === 'user.name' && <SortArrow direction={sortConfig.direction} />}
                    Användare
                </h3>
                <h3 onClick={() => requestSort('numberOfVevs')}>
                    {sortConfig.key === 'numberOfVevs' && <SortArrow direction={sortConfig.direction} />}
                    Antal vev
                </h3>
                <h3 onClick={() => requestSort('numberOfVevsWon')}>
                    {sortConfig.key === 'numberOfVevsWon' && <SortArrow direction={sortConfig.direction} />}
                    Vunna
                </h3>
                <h3 onClick={() => requestSort('numberOfVevsLost')}>
                    {sortConfig.key === 'numberOfVevsLost' && <SortArrow direction={sortConfig.direction} />}
                    Förlorade
                </h3>
                <h3 onClick={() => requestSort('winPercentage')}>
                    {sortConfig.key === 'winPercentage' && <SortArrow direction={sortConfig.direction} />}
                    Vinstprocent
                </h3>
            </header>
            {sortedPeopleStats.map((personStats: userStats, index: number) => (
                <UserStatsElement key={index} personStats={personStats} index={index} />
            ))}
        </ul>
    )
}

export default StatsPage;

const UserStatsElement = ({ personStats, index }: { personStats: userStats, index: number }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <PopupDiv key={index} show={showPopup} setShow={setShowPopup}>
                <div className="userStats">
                    <p>Användare: {personStats.user.name}</p>
                    <p>Gick med: {personStats.user.createdAt.toLocaleDateString()}</p>
                    <br />
                    <p>Antal vev: {personStats.numberOfVevs}</p>
                    <p>Vinster: {personStats.numberOfVevsWon}</p>
                    <p>Förluster: {personStats.numberOfVevsLost}</p>
                    <p>Vinstprocent: {personStats.winPercentage}%</p>
                </div>
            </PopupDiv>

            <li onClick={() => setShowPopup(true)} key={`userstat-${personStats.user.id}`} className={`userStatLi tableElement ${index % 2 === 0 ? 'colored' : ''}`} >
                <p>{personStats.user.name}</p>
                <p>{personStats.numberOfVevs}</p>
                <p>{personStats.numberOfVevsWon}</p>
                <p>{personStats.numberOfVevsLost}</p>
                <p>{personStats.winPercentage}%</p>
            </li>
        </>
    )
}

const SortArrow = ({ direction }: { direction: 'ascending' | 'descending' }) => {
    return (
        <img src={direction === 'descending' ? '/images/arrowUp.svg' : '/images/arrowDown.svg'} alt="Sort arrow" />
    )
}
