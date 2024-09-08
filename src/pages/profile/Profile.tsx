import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import "./profile.css";
import { useEffect, useState } from "react";
import { Post as IPost } from "../main/main";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Post } from "../main/Post";

export const Profile = () => {
  const auth = getAuth();
  const [postList, savePostList] = useState<IPost[] | null>(null);
  const postRef = collection(db, "posts");
  const [user] = useAuthState(auth);
  const getPost = async () => {
    const data = await getDocs(postRef);
    savePostList(
      data.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          } as IPost)
      )
    );
  };

  const testDelete = () => {};

  useEffect(() => {
    getPost();
  }, []);
  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      {user ? (
        <div className="profile-details">
          <img
            src={user.photoURL || "/default-profile.png"}
            alt="Profile"
            className="profile-photo"
          />
          <div className="profile-info">
            <h3>Username: {user.displayName || "N/A"}</h3>
            <p>Email: {user.email}</p>
          </div>
          <h3>List of My Post</h3>
          <div>
            {postList
              ?.filter((post) => post.userId == auth.currentUser?.uid)
              .map((postdata) => (
                <Post post={postdata} onDelete={testDelete} />
              ))}
          </div>
        </div>
      ) : (
        <p>User is not logged in.</p>
      )}
    </div>
  );
};
