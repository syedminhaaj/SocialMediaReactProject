import { auth, db, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "@firebase/firestore";
export const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const docref = doc(db, "users", user.uid);
    const docsnap = await getDoc(docref);
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
      timestamp: serverTimestamp(),
    });
    navigate("/");
  };
  return (
    <div>
      <h3>Please Sign In using Google Account </h3>
      <div>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
};
