import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { Post } from "./Post";
import { useAuthState } from "react-firebase-hooks/auth";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

export const Main = () => {
  const [postList, savePostList] = useState<Post[] | null>(null);
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
          } as Post)
      )
    );
  };

  useEffect(() => {
    getPost();
  }, []);
  return (
    <div>
      {postList?.map((postdata) => (
        <Post post={postdata} />
      ))}
    </div>
  );
};
