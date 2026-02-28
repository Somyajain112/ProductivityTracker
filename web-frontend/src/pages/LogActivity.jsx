import { useEffect, useState } from 'react';
import { getActivities, createLog } from '../api/api';

const LogActivity = () => {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    activity: '',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: '',
    notes: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getActivities().then((res) => setActivities(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createLog(form);
      setSuccess('Activity logged successfully! ✅');
      setForm({
        activity: '',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: '',
        notes: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log activity');
    }
  };

  return (
    <div className="log-page">
      <h2>Log Activity ✏️</h2>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="log-form">
        <label>Activity</label>
        <select
          value={form.activity}
          onChange={(e) => setForm({ ...form, activity: e.target.value })}
          required
        >
          <option value="">-- Select Activity --</option>
          {activities.map((act) => (
            <option key={act._id} value={act._id}>
              {act.name} ({act.category})
            </option>
          ))}
        </select>

        <label>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <label>Duration (minutes)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 60"
          value={form.durationMinutes}
          onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
          required
        />

        <label>Notes (optional)</label>
        <textarea
          placeholder="Any notes about this session..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />

        <button type="submit">Log Activity</button>
      </form>
    </div>
  );
};

export default LogActivity;
