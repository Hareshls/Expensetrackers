import "../../styles/card.css";

const Card = ({ title, children }) => {
  return (
    <div className="card">
      {title && <h3 className="card-heading">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
