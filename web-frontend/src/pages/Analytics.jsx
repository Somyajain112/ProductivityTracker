import { useEffect, useState } from 'react';
import { getAnalyticsSummary, getDailyAnalytics } from '../api/api';

const Analytics = () => {
  const [summary, setSummary] = useState([]);
  const [daily, setDaily] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, dailyRes] = await Promise.all([
        getAnalyticsSummary(startDate, endDate),
        getDailyAnalytics(startDate, endDate),
      ]);
      setSummary(summaryRes.data);
      setDaily(dailyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-page">
      <h2>Analytics 📊</h2>

      {/* Date Range Filter */}
      <div className="date-filter">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchAnalytics}>Apply</button>
      </div>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <h3>Activity Summary</h3>
          <div className="summary-grid">
            {summary.map((item) => (
              <div
                key={item._id}
                className="summary-card"
                style={{ borderLeft: `4px solid ${item.color}` }}
              >
                <h4>{item.activityName}</h4>
                <p>{item.totalHours} hours</p>
                <p className="muted">{item.count} sessions</p>
              </div>
            ))}
          </div>

          {/* Daily Breakdown Table */}
          <h3>Daily Breakdown</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity</th>
                <th>Category</th>
                <th>Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>
                    <span
                      className="dot"
                      style={{ backgroundColor: row.color }}
                    />
                    {row.activityName}
                  </td>
                  <td>{row.category}</td>
                  <td>{row.totalMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Analytics;
