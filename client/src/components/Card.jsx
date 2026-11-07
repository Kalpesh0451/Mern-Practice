function Card({ title, description, icon }) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="text-primary mb-3 fs-2">{icon}</div>
        <h5 className="fw-bold">{title}</h5>
        <p className="text-secondary mb-0">{description}</p>
      </div>
    </div>
  );
}

export default Card;