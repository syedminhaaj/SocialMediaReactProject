import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import "./navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const signUserOut = async () => {
    await signOut(auth)
      .then(() => {
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="navbar">
      <div>
        <h3>{auth.currentUser?.displayName}</h3>
      </div>

      <div className="user">
        <span className="links">
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
        </span>
        {user && (
          <div>
            <div className="container">
              <div ref={dropdownRef} className="dropdown-container">
                <img
                  src={auth.currentUser?.photoURL || ""}
                  width="20"
                  height="20"
                />
                <button onClick={toggleDropdown} className="button">
                  <span className="arrow">▼</span>
                </button>
                {isOpen && (
                  <ul className="dropdown">
                    <Link className="dropdownItem" to="/profile">
                      Profile
                    </Link>
                    <li className="dropdownItem" onClick={handleSignOut}>
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
