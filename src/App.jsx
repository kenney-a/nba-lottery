import { useState } from 'react';
import lotteryData from './lotteryData.json';
import './App.css';

function App() {
  // Get all years from the data
  const years = lotteryData.map((d) => d.year).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [mode, setMode] = useState('post'); // 'pre' or 'post'

  const yearData = lotteryData.find((d) => d.year === selectedYear);
  const tableRows =
    mode === 'pre'
      ? yearData.preLottery.map((row, i) => (
          <tr key={row.slot}>
            <td>{row.slot}</td>
            <td>{row.team}</td>
            <td>{row.record}</td>
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
          </tr>
        ));

  return (
    <div className="App">
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
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default App;
