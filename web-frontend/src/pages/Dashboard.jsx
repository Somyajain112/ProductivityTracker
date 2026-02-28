import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLogs, getInsights } from '../api/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get today's logs
        const today = new Date().toISOString().split('T')[0];
        const [logsRes, insightsRes] = await Promise.all([
          getLogs(today, today),
          getInsights(),
        ]);
        setLogs(logsRes.data);
        setInsights(insightsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalMinutesToday = logs.reduce((sum, log) => sum + log.durationMinutes, 0);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Hello, {user?.name} 👋</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-grid">
          {/* Today's Summary */}
          <div className="card">
            <h3>Today's Activity</h3>
            <p className="big-number">{(totalMinutesToday / 60).toFixed(1)}h</p>
            <p>logged today</p>
          </div>

          {/* Weekly Insights */}
          {insights && (
            <div className="card">
              <h3>Last 7 Days</h3>
              <p className="big-number">{insights.last7DaysTotalHours}h</p>
              <p>avg {insights.avgDailyHours}h/day</p>
            </div>
          )}

          {/* Category Breakdown */}
          {insights?.categoryBreakdown && (
            <div className="card">
              <h3>Activity Breakdown</h3>
              {Object.entries(insights.categoryBreakdown).map(([cat, mins]) => (
                <div key={cat} className="category-row">
                  <span className="category-label">{cat}</span>
                  <span className="category-value">{(mins / 60).toFixed(1)}h</span>
                </div>
              ))}
            </div>
          )}

          {/* Today's Logs */}
          <div className="card full-width">
            <h3>Today's Logs</h3>
            {logs.length === 0 ? (
              <p>No activities logged today. Start tracking!</p>
            ) : (
              <ul className="log-list">
                {logs.map((log) => (
                  <li key={log._id} className="log-item">
                    <span
                      className="log-dot"
                      style={{ backgroundColor: log.activity?.color || '#4F46E5' }}
                    />
                    <span className="log-name">{log.activity?.name}</span>
                    <span className="log-duration">{log.durationMinutes} min</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
