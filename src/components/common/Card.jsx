function Card({
    children,
    title,
    subtitle,
    accent = false,
    className = "",
})
{
    const cardClassName = [
        "common-card",
        accent ? "common-card-accent" : "",
        className,
    ]
    .filter(Boolean)
    .join(" ");

    return (
        <section className={cardClassName}>
            {(title || subtitle) && (
                <div className="common-card-header">
                    {title && <h2 className="common-card-title">{title}</h2>}
                    {subtitle && <p className="common-card-subtitle">{subtitle}</p>}
                </div>
            )}
            {children}
        </section>
    );
}

export default Card;