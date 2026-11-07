function Button({ children, variant = "primary", onClick, type = "button" }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;