import "./StatsPage.css";
import { useState } from "react";
import { usePeopleContext } from "../../Contexts/PeopleContext";
import { useVevContext } from "../../Contexts/VevContext";
import { getUserStats } from "../../Util/stats";
import { userStats } from "../../types";
import { Key } from "react";

const StatsPage = () => {
    const { allPeople } = usePeopleContext();
    const { allVevs } = useVevContext();

    const [sortConfig, setSortConfig] = useState<{ key: keyof userStats, direction: 'ascending' | 'descending' }>({ key: 'user.name', direction: 'ascending' });

    const allPeopleStats: userStats[] = allPeople.map(person => {
        return getUserStats(person, allVevs);
    });

    const sortedPeopleStats = [...allPeopleStats];
    if (sortConfig !== null) {
        sortedPeopleStats.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    const requestSort = (key: keyof userStats) => {
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
            {sortedPeopleStats.map((personStats: userStats, index: number) => {
                return (
                    <li key={index} className={`tableElement ${index % 2 === 0 ? 'colored' : ''}`} >
                        <p>{personStats.user.name}</p>
                        <p>{personStats.numberOfVevs}</p>
                        <p>{personStats.numberOfVevsWon}</p>
                        <p>{personStats.numberOfVevsLost}</p>
                        <p>{personStats.winPercentage}%</p>
                    </li>
                )
            })}
        </ul>
    )
}

export default StatsPage;

const SortArrow = ({ direction }: { direction: 'ascending' | 'descending' }) => {
    return (
        <img src={direction === 'descending' ? '/images/arrowUp.svg' : '/images/arrowDown.svg'} alt="Sort arrow" />
    )
}