function NotificationEmpty() {

    return (

        <div
            style={{
                padding: "60px",
                textAlign: "center",
                color: "#94a3b8",
                background: "#fff",
                borderRadius: "18px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)"
            }}
        >

            <h3 style={{ color: "#0f172a", fontWeight: "800" }}>No Notifications Found</h3>

            <p>
                You're all caught up.
            </p>

        </div>

    );

}

export default NotificationEmpty;