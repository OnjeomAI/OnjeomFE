function Input({
    label,
    type = "text",
    name,
    value,
    placeholder,
    onChange,
    autoComplete,
    disabled = false,
    error,
    variant = "box",
    className = "",
    multiline = false,
    rows = 4,
}) {
    const inputClassName = [
        "common-input",
        `common-input-${variant}`,
        multiline ? "common-input-textarea" : "",
        error ? "common-input-error" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="common-input-group">
            {label && <label className="common-input-label">{label}</label>}

            {multiline ? (
                <textarea
                    className={inputClassName}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    rows={rows}
                />
            ) : (
                <input
                    className={inputClassName}
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    disabled={disabled}
                />
            )}

            {error && <p className="common-input-message">{error}</p>}
        </div>
    );
}

export default Input;
