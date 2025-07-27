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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Moneyball Players state
  const [selectedSeason, setSelectedSeason] = useState('2023-24');
  const [sortBy, setSortBy] = useState('valueRating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedPosition, setSelectedPosition] = useState('All Positions');

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
    <div style={{ color: '#000000' }}>
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
    
    // Filter players based on search and filters
    let filteredPlayers = players.filter(player => {
      const searchLower = searchTerm.toLowerCase().trim();
      const nameLower = player.name.toLowerCase();
      const teamLower = player.team.toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
                           nameLower.includes(searchLower) ||
                           teamLower.includes(searchLower);
      const matchesTeam = selectedTeam === 'All Teams' || player.team === selectedTeam;
      const matchesPosition = selectedPosition === 'All Positions' || player.position === selectedPosition;
      
      return matchesSearch && matchesTeam && matchesPosition;
    });
    
    // Sort players based on selected criteria
    const sortedPlayers = [...filteredPlayers].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle string sorting for name, team, and position
      if (sortBy === 'name' || sortBy === 'team' || sortBy === 'position') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    const formatSalary = (salary) => {
      return `$${(salary / 1000000).toFixed(1)}M`;
    };

    const formatPercentage = (value) => {
      return value ? `${value}%` : 'N/A';
    };

    // Get unique teams and positions for filters
    const teams = ['All Teams', ...new Set(players.map(p => p.team))];
    const positions = ['All Positions', ...new Set(players.map(p => p.position))];

    // Handle column sorting
    const handleSort = (column) => {
      if (sortBy === column) {
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
      } else {
        setSortBy(column);
        setSortOrder('desc');
      }
    };

    // Get sort indicator for column headers
    const getSortIndicator = (column) => {
      if (sortBy !== column) return '↕';
      return sortOrder === 'desc' ? '↓' : '↑';
    };

    return (
      <div>
        <h1>Moneyball Players</h1>
        <p>Discover undervalued players and advanced analytics insights from 200+ NBA players.</p>
        
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
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
            
            <label>
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
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <label>
              Search:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or team..."
                style={{ marginLeft: 8, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </label>
            
            <label>
              Team:
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                style={{ marginLeft: 8 }}
              >
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>
            
            <label>
              Position:
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                style={{ marginLeft: 8 }}
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </label>
          </div>


        </div>

        <div className="moneyball-table">
          <table>
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('rank')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Rank {getSortIndicator('rank')}
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Player {getSortIndicator('name')}
                </th>
                <th 
                  onClick={() => handleSort('team')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Team {getSortIndicator('team')}
                </th>
                <th 
                  onClick={() => handleSort('position')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Pos {getSortIndicator('position')}
                </th>
                <th 
                  onClick={() => handleSort('gamesPlayed')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  GP {getSortIndicator('gamesPlayed')}
                </th>
                <th 
                  onClick={() => handleSort('pointsPerGame')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  PPG {getSortIndicator('pointsPerGame')}
                </th>
                <th 
                  onClick={() => handleSort('reboundsPerGame')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  RPG {getSortIndicator('reboundsPerGame')}
                </th>
                <th 
                  onClick={() => handleSort('assistsPerGame')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  APG {getSortIndicator('assistsPerGame')}
                </th>
                <th 
                  onClick={() => handleSort('fieldGoalPercentage')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  FG% {getSortIndicator('fieldGoalPercentage')}
                </th>
                <th 
                  onClick={() => handleSort('threePointPercentage')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  3P% {getSortIndicator('threePointPercentage')}
                </th>
                <th 
                  onClick={() => handleSort('freeThrowPercentage')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  FT% {getSortIndicator('freeThrowPercentage')}
                </th>
                <th 
                  onClick={() => handleSort('salary')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Salary {getSortIndicator('salary')}
                </th>
                <th 
                  onClick={() => handleSort('valueRating')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Value Rating {getSortIndicator('valueRating')}
                </th>
                <th 
                  onClick={() => handleSort('efficiencyRating')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Efficiency {getSortIndicator('efficiencyRating')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={`${player.name}-${selectedSeason}-${index}`}>
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
        
        <div style={{ marginTop: 20, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8, color: '#000000', textAlign: 'left' }}>
          <h3>Analytics Insights</h3>
          <div>
            <div><strong>Value Rating:</strong> Combines production, efficiency, and salary to identify the best value players</div>
            <div><strong>Efficiency Rating:</strong> Advanced metric considering shooting percentages, turnovers, and overall impact</div>
            <div><strong>Top Value Picks:</strong> Players like Tyrese Haliburton and Anthony Edwards provide exceptional production relative to their salary</div>
            <div><strong>Efficiency Leaders:</strong> Nikola Jokić and Joel Embiid lead in overall efficiency despite high salaries</div>
            <div><strong>Dataset:</strong> Comprehensive analysis of 200+ NBA players from the last two seasons</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>All NBA</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-tab ${activeTab === 'lottery' ? 'active' : ''}`}
            onClick={() => setActiveTab('lottery')}
          >
            <span>🏀</span>
            <span>NBA Lottery</span>
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'trades' ? 'active' : ''}`}
            onClick={() => setActiveTab('trades')}
          >
            <span>📊</span>
            <span>Trade Grades</span>
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'moneyball' ? 'active' : ''}`}
            onClick={() => setActiveTab('moneyball')}
          >
            <span>💰</span>
            <span>Moneyball Players</span>
          </button>
        </nav>
      </div>
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {activeTab === 'lottery' && renderLotteryContent()}
        {activeTab === 'trades' && renderTradeGradesContent()}
        {activeTab === 'moneyball' && renderMoneyballContent()}
      </div>
    </div>
  );
}

export default App;
