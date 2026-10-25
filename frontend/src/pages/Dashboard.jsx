import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // Logout Function
    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");
    };

    return (

        <div>

            {/* Navbar */}

            <nav className="navbar navbar-dark bg-primary px-4">

                <h3 className="text-white">
                    Medi Track
                </h3>

                <div className="d-flex align-items-center">

                    <h5 className="text-white me-4 mb-0">

                        Welcome {user?.username}

                    </h5>

                    <button
                        className="btn btn-light"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* Main Section */}

            <div className="container mt-5">

                <h2>
                    Search Medicines
                </h2>

                <input
                    type="text"
                    placeholder="Search Medicine..."
                    className="form-control mt-3"
                />

                <div className="mt-5">

                    <h3>
                        Nearby Medical Shops
                    </h3>

                    <div className="card p-3 mt-3 shadow">

                        <h5>
                            Apollo Medical
                        </h5>

                        <p>
                            Location: Malad West
                        </p>

                        <p>
                            Contact: 9876543210
                        </p>

                        <button className="btn btn-success">

                            Place Order

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;