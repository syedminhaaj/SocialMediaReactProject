import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IComment, ILikes, IPost, IUser } from "../base-utils/common-utils";
import { auth, db, storage } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
export interface IState {
  comments: IComment[];
  users: IUser[];
  posts: IPost[];
  likes: ILikes[];
}

const initialState: IState = {
  comments: [],
  users: [],
  posts: [],
  likes: [],
};
const postRef = collection(db, "posts");

export const fetchPosts = () => async (dispatch: any) => {
  try {
    const snapshot = await getDocs(postRef);
    const posts: any[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    dispatch(SocialMediaSlice.actions.getAllPostReducer(posts)); // Dispatch the fetched posts
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

export const SocialMediaSlice = createSlice({
  name: "socialMediaReducer",
  initialState,
  reducers: {
    addPost: (state, action) => {
      const data = action.payload;

      addDoc(postRef, {
        title: data?.title,
        description: data?.description,
        username: data?.username,
        userId: data?.userId,
        photoUrl: data.photoUrl,
        imageUrl: data.imageUrl,
        time: data.time,
      });
    },
    getAllPostReducer: (state, action) => {
      const posts = action.payload;
      state.posts = posts;
    },
  },
});

export const { addPost, getAllPostReducer } = SocialMediaSlice.actions;
export default SocialMediaSlice.reducer;
