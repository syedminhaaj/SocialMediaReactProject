import { signOut } from "@firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const signUserOut = async () => {
    await signOut(auth);
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
            <img
              src={auth.currentUser?.photoURL || ""}
              width="20"
              height="20"
            />
            <button onClick={signUserOut}>logout</button>
          </div>
        )}
      </div>
    </div>
  );
};
