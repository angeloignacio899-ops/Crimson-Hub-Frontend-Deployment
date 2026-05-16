const Button = ({ label, children, onClick, className="", disabled, type="button" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {label}
            {children}
        </button>
    );
}
export default Button;