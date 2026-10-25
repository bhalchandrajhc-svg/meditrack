import "./StatCard.css";

function StatCard({
    title,
    value,
    icon,
    color,
    subtitle
}) {
    return (
        <div className="stat-card">

            <div
                className="icon-box"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div className="card-info">

                <h4>{title}</h4>

                <h2>{value}</h2>

                <small>{subtitle}</small>

            </div>

        </div>
    );
}

export default StatCard;