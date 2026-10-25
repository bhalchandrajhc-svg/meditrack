import "./ProfileDropdown.css";

import {

    User,

    Settings,

    LogOut

} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function ProfileDropdown({

    onClose

}) {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };

    return (

        <div className="profile-dropdown">

            <Link

                to="/vendor/settings"

                onClick={onClose}

            >

                <User size={18}/>

                My Profile

            </Link>

            <Link

                to="/vendor/settings"

                onClick={onClose}

            >

                <Settings size={18}/>

                Settings

            </Link>

            <button onClick={logout}>

                <LogOut size={18}/>

                Logout

            </button>

        </div>

    );

}

export default ProfileDropdown;