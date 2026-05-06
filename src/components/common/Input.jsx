function Input({
    label,
    type = "text",
    name,
    value,
    placeholder,
    onChange,
    disabled = false,
    error,
    className = "",
})
{
    const inputClassName = [
        "common-input",
        error ? "common-input-error" : "",
        className,
    ]
    .filter(Boolean)
    .join(" ");

    return (
        <div className="common-input-group">
            {label && <label className="common-input-label">{label}</label>}

            <input
                className={inputClassName}
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
            />

            {error && <p className="common-input-message">{error}</p>}
        </div>
    );
}

export default Input;