function Button({
    children,
    type = "button",
    variant = "primary",
    size = "medium",
    fullWidth = false,
    disabled = false,
    onClick,
    className = "",
})
{
    const buttonClassName = [
        "common-button",
        `common-button-${variant}`,
        `common-button-${size}`,
        fullWidth ? "common-button-full" : "",
        className,
    ]
    .filter(Boolean)
    .join(" ");

    return (
        <button
            type={type}
            className={buttonClassName}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;