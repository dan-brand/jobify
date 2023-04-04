import Wrapper from "../assets/wrappers/Navbar"
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useAppContext } from "../context/appContext";
import Logo from './Logo'
import { useState } from "react";

function Navbar() {
    const [showLogout, setShowLogout] = useState(false);
    const { toggleSidebar, logoutUser, user } = useAppContext();

    return (
        <Wrapper>
            <div className="nav-center">
                <button onClick={toggleSidebar} className="toggle-btn"><FaAlignLeft /></button>
                <div>
                    <Logo />
                    <h3 className="logo-text">Dashboard</h3>
                </div>
                <div className="btn-container">
                    
                    <button onClick={() => setShowLogout(!showLogout)} className="btn"><FaUserCircle />{user?.name}<FaCaretDown /></button>
                    <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
                        <button onClick={logoutUser} className="dropdown-btn">Logout</button>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

// optional chaining user?.name checks if user first exists and then displays the name. User can be null and just doing user.name is null.name which looks for name on null which will cause errors

export default Navbar;