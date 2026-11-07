function StatCard({ title, value, icon, color, change }) {
  return (
    <div className="stat-card">
      <div>
        <p className="text-secondary mb-2">{title}</p>
        <h3 className="fw-bold mb-2">{value}</h3>
        <small className="text-success">{change}</small>
      </div>

      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
    </div>
  );
}

export default StatCard;