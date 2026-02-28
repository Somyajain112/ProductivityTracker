import { useEffect, useState } from 'react';
import { getActivities, createActivity, deleteActivity } from '../api/api';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'custom', color: '#4F46E5' });
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    const res = await getActivities();
    setActivities(res.data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createActivity(form);
      setForm({ name: '', category: 'custom', color: '#4F46E5' });
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create activity');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await deleteActivity(id);
      fetchActivities();
    } catch (err) {
      setError('Failed to delete activity');
    }
  };

  return (
    <div className="activities-page">
      <h2>My Activities 🏷️</h2>

      {error && <div className="error-msg">{error}</div>}

      {/* Create Form */}
      <form onSubmit={handleCreate} className="activity-form">
        <input
          type="text"
          placeholder="Activity name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="study">Study</option>
          <option value="sleep">Sleep</option>
          <option value="exercise">Exercise</option>
          <option value="custom">Custom</option>
        </select>
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          title="Pick a color"
        />
        <button type="submit">+ Add Activity</button>
      </form>

      {/* Activities List */}
      <ul className="activity-list">
        {activities.map((act) => (
          <li key={act._id} className="activity-item">
            <span
              className="activity-color-dot"
              style={{ backgroundColor: act.color }}
            />
            <span className="activity-name">{act.name}</span>
            <span className="activity-category">{act.category}</span>
            <button
              className="delete-btn"
              onClick={() => handleDelete(act._id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activities;
