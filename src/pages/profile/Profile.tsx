import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import "./profile.css";
import { useEffect, useState } from "react";
import { Post as IPost } from "../main/main";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Post } from "../main/Post";
import Loader from "../Loader/Loader";

export const Profile = () => {
  const auth = getAuth();
  const [userList, saveUserList] = useState<IPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const postRef = collection(db, "posts");
  const [user] = useAuthState(auth);
  const getPost = async () => {
    setLoading(true);
    const data = await getDocs(postRef);
    saveUserList(
      data.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          } as IPost)
      )
    );
    setLoading(false);
  };

  const DeletePost = (postId: string) => {
    saveUserList((prevPosts: any) =>
      prevPosts.filter((post: any) => post.id !== postId)
    );
  };

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
            <h3>{user.displayName || "N/A"}</h3>
            <p>
              <b>Email:</b> {user.email}
            </p>
          </div>
          <h3>List of My Post</h3>
          <span>
            <b>Note:</b> You can edit/delete post by hovering on post and click
            edit/delete button on top right of the post
          </span>
          {}
          <div>
            {loading ? (
              <Loader />
            ) : (
              <>
                {userList
                  ?.filter((post) => post.userId == auth.currentUser?.uid)
                  .map((postdata) => (
                    <Post post={postdata} onDelete={DeletePost} />
                  ))}
              </>
            )}
          </div>
        </div>
      ) : (
        <p>User is not logged in.</p>
      )}
    </div>
  );
};
