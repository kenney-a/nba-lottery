import { useState } from 'react';
import lotteryData from './lotteryData.json';
import './App.css';

function App() {
  // Get all years from the data
  const years = lotteryData.map((d) => d.year).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [mode, setMode] = useState('post'); // 'pre' or 'post'
  const [activeTab, setActiveTab] = useState('lottery'); // 'lottery', 'trades', 'moneyball'

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

  const renderMoneyballContent = () => (
    <div>
      <h1>Moneyball Players</h1>
      <p>Discover undervalued players and advanced analytics insights.</p>
      <div style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <h3>Player Analytics</h3>
        <ul>
          <li>Advanced stats and metrics</li>
          <li>Player efficiency ratings</li>
          <li>Value contracts and underrated players</li>
          <li>Statistical analysis and insights</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>NBA Analytics</h2>
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
