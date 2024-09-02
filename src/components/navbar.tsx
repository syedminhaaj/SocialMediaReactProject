import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import "./navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();

  const signUserOut = async () => {
    await signOut(auth)
      .then(() => {
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  const [isOpen, setIsOpen] = useState(false);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="navbar">
      <div className="links">
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <Link to="/createPost">Create Post</Link>
        )}
        {!user ? (
          <Link to="/home">Home</Link>
        ) : (
          <Link to="/main">View Post</Link>
        )}
      </div>

      <div className="user">
        {user && (
          <div>
            <p>{auth.currentUser?.displayName}</p>
            <div className="container">
              <img
                src={auth.currentUser?.photoURL || ""}
                width="20"
                height="20"
              />
              {/* <button onClick={signUserOut}>logout</button> */}

              <button onClick={toggleDropdown} className="button">
                <span className="arrow">▼</span>
              </button>
              {isOpen && (
                <ul className="dropdown">
                  <li className="dropdownItem" onClick={handleSignOut}>
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
