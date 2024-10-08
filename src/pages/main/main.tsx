import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { Post } from "./Post";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  getAllPostReducer,
  IState,
} from "../../reducer/mediaSlice";
import { AppDispatch } from "../../store/store";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  imageUrl: string;
  photoUrl: string;
  time: string;
}

export const Main = () => {
  const [postList, savePostList] = useState<Post[] | null>(null);
  const postRef = collection(db, "posts");
  const [user] = useAuthState(auth);
  const dispatch = useDispatch<AppDispatch>();
  const postListArray = useSelector((state: IState) => state.posts);
  const getPost = () => {
    dispatch(fetchPosts());
  };

  const handlePostDelete = (postId: string) => {
    // Remove the deleted post from the state
    savePostList((prevPosts: any) =>
      prevPosts.filter((post: any) => post.id !== postId)
    );
  };

  useEffect(() => {
    getPost();
  }, []);
  return (
    <div>
      {postListArray?.map((postdata) => (
        <Post post={postdata} onDelete={handlePostDelete} />
      ))}
    </div>
  );
};
