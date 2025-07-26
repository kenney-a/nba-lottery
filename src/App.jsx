import { useState } from 'react';
import lotteryData from './lotteryData.json';
import playerData from './playerData.json';
import './App.css';

function App() {
  // Get all years from the data
  const years = lotteryData.map((d) => d.year).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [mode, setMode] = useState('post'); // 'pre' or 'post'
  const [activeTab, setActiveTab] = useState('lottery'); // 'lottery', 'trades', 'moneyball'
  
  // Moneyball Players state
  const [selectedSeason, setSelectedSeason] = useState('2023-24');
  const [sortBy, setSortBy] = useState('valueRating');
  const [sortOrder, setSortOrder] = useState('desc');

  const yearData = lotteryData.find((d) => d.year === selectedYear);
  const tableRows =
    mode === 'pre'
      ? yearData.preLottery.map((row, i) => (
          <tr key={row.slot}>
            <td>{row.slot}</td>
            <td>{row.team}</td>
            <td>{row.record}</td>
            <td>{row.probability}%</td>
          </tr>
        ))
      : yearData.postLottery.map((row, i) => (
          <tr key={row.pick}>
            <td>{row.pick}</td>
            <td>{row.team}</td>
            <td>{
              yearData.preLottery.find((t) => t.slot === row.preSlot)?.record || ''
            }</td>
            <td>{row.preSlot}</td>
            <td>{row.probability}%</td>
          </tr>
        ));

  const renderLotteryContent = () => (
    <div>
      <h1>NBA Draft Lottery Results</h1>
      <div style={{ marginBottom: 16 }}>
        <label>
          Year:
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <button
          style={{ marginLeft: 16 }}
          onClick={() => setMode('pre')}
          className={mode === 'pre' ? 'active' : ''}
        >
          Pre-Lottery
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => setMode('post')}
          className={mode === 'post' ? 'active' : ''}
        >
          Post-Lottery
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>{mode === 'pre' ? 'Slot' : 'Pick'}</th>
            <th>Team</th>
            <th>Record</th>
            {mode === 'post' && <th>Pre-Lottery Slot</th>}
            <th>Probability</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );

  const renderTradeGradesContent = () => (
    <div>
      <h1>Trade Grades</h1>
      <p>Coming soon! This section will feature analysis and grades for NBA trades.</p>
      <div style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <h3>Recent Trades</h3>
        <ul>
          <li>Trade analysis and grades will be displayed here</li>
          <li>Win-win, win-lose, and lose-lose trade evaluations</li>
          <li>Historical trade impact analysis</li>
        </ul>
      </div>
    </div>
  );

  const renderMoneyballContent = () => {
    const seasonData = playerData.find((d) => d.season === selectedSeason);
    const players = seasonData ? seasonData.players : [];
    
    // Sort players based on selected criteria
    const sortedPlayers = [...players].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    const formatSalary = (salary) => {
      return `$${(salary / 1000000).toFixed(1)}M`;
    };

    const formatPercentage = (value) => {
      return value ? `${value}%` : 'N/A';
    };

    return (
      <div>
        <h1>Moneyball Players</h1>
        <p>Discover undervalued players and advanced analytics insights.</p>
        
        <div style={{ marginBottom: 16 }}>
          <label>
            Season:
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              {playerData.map((season) => (
                <option key={season.season} value={season.season}>
                  {season.season}
                </option>
              ))}
            </select>
          </label>
          
          <label style={{ marginLeft: 16 }}>
            Sort by:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="valueRating">Value Rating</option>
              <option value="efficiencyRating">Efficiency Rating</option>
              <option value="pointsPerGame">Points Per Game</option>
              <option value="reboundsPerGame">Rebounds Per Game</option>
              <option value="assistsPerGame">Assists Per Game</option>
              <option value="salary">Salary</option>
            </select>
          </label>
          
          <button
            style={{ marginLeft: 16 }}
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
          </button>
        </div>

        <div className="moneyball-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Team</th>
                <th>Pos</th>
                <th>GP</th>
                <th>PPG</th>
                <th>RPG</th>
                <th>APG</th>
                <th>FG%</th>
                <th>3P%</th>
                <th>FT%</th>
                <th>Salary</th>
                <th>Value Rating</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={`${player.name}-${selectedSeason}`}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.team}</td>
                  <td>{player.position}</td>
                  <td>{player.gamesPlayed}</td>
                  <td>{player.pointsPerGame}</td>
                  <td>{player.reboundsPerGame}</td>
                  <td>{player.assistsPerGame}</td>
                  <td>{formatPercentage(player.fieldGoalPercentage)}</td>
                  <td>{formatPercentage(player.threePointPercentage)}</td>
                  <td>{formatPercentage(player.freeThrowPercentage)}</td>
                  <td>{formatSalary(player.salary)}</td>
                  <td>{player.valueRating}/10</td>
                  <td>{player.efficiencyRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: 20, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
          <h3>Analytics Insights</h3>
          <ul>
            <li><strong>Value Rating:</strong> Combines production, efficiency, and salary to identify the best value players</li>
            <li><strong>Efficiency Rating:</strong> Advanced metric considering shooting percentages, turnovers, and overall impact</li>
            <li><strong>Top Value Picks:</strong> Players like Tyrese Haliburton and Anthony Edwards provide exceptional production relative to their salary</li>
            <li><strong>Efficiency Leaders:</strong> Nikola Jokić and Joel Embiid lead in overall efficiency despite high salaries</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>All NBA</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-tab ${activeTab === 'lottery' ? 'active' : ''}`}
            onClick={() => setActiveTab('lottery')}
          >
            NBA Lottery
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'trades' ? 'active' : ''}`}
            onClick={() => setActiveTab('trades')}
          >
            Trade Grades
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'moneyball' ? 'active' : ''}`}
            onClick={() => setActiveTab('moneyball')}
          >
            Moneyball Players
          </button>
        </nav>
      </div>
      <div className="main-content">
        {activeTab === 'lottery' && renderLotteryContent()}
        {activeTab === 'trades' && renderTradeGradesContent()}
        {activeTab === 'moneyball' && renderMoneyballContent()}
      </div>
    </div>
  );
}

export default App;
