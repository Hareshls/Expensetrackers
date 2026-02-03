import "../../styles/button.css";

const Button = ({ text, onClick, type = "button", variant = "primary" }) => {
  return (
    <button
      type={type}
      className={`btn ${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
