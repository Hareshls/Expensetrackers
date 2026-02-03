const StatsCard = ({ title, value, green, icon: Icon, color }) => {
  return (
    <div className="card stat-card animate-in">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper" style={{ backgroundColor: color + "15", color: color }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {green && (
        <div className="stat-trend success">
          <span className="trend-arrow">↑</span>
          {green}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
