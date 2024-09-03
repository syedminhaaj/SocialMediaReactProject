import { Post as IPost } from "./main";
import { auth, db } from "../../config/firebase";

import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "./main.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { CustomTooltip } from "./Tooltip/CustomTooltip";
import { CustomIconButton } from "../../Common-Utils/CustomIconButton";
import PostWithComment from "../comment/PostComment";
import CommentIcon from "@mui/icons-material/Comment";
import { IconButton, TextField, InputAdornment } from "@mui/material";

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
  username: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[] | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [comment, setComment] = useState("");
  const likesRef = collection(db, "likes");
  const likesDoc = query(likesRef, where("postId", "==", post?.id));

  const handleIconClick = () => {
    setShowInput(!showInput);
  };

  const handleInputChange = (event: any) => {
    setComment(event.target.value);
  };

  const handleInputBlur = () => {
    // You can handle the input blur event to save the comment or reset the state
    setShowInput(false);
  };

  const getLikes = async () => {
    const data = await getDocs(likesDoc);

    const likesData = data.docs.map((doc) => ({
      userId: doc.data().userId,
      likeId: doc.id,
      username: doc.data().username,
    }));
    setLikes(likesData);
  };

  const addLike = async () => {
    try {
      console.log("user", user);
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
        username: user?.displayName,
      });
      if (user) {
        setLikes((prev: any) =>
          prev
            ? [
                ...prev,
                {
                  userId: user?.uid,
                  likeId: newDoc.id,
                  username: user?.displayName,
                },
              ]
            : [
                {
                  userId: post.id,
                  likeId: newDoc.id,
                  username: user?.displayName,
                },
              ]
        );
      }
    } catch {
      console.log("API call for adding like is failed");
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );
      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeDelete = doc(db, "likes", likeId);
      await deleteDoc(likeDelete);

      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch {
      console.log("API call for adding like is failed");
    }
  };

  const hasUserLiked = likes?.find((like) => {
    return like.userId === user?.uid;
  });

  useEffect(() => {
    getLikes();
  }, []);
  return (
    <div className="post-container">
      <div className="post-title">
        <h1>{post.title}</h1>
      </div>
      <div className="post-content">
        <p>{post.description}</p>
      </div>
      <div className="post-footer">
        <p className="post-username">@{post.username}</p>
        <button
          className="button-cls"
          onClick={hasUserLiked ? removeLike : addLike}
        >
          {hasUserLiked ? (
            <CustomIconButton>
              <ThumbDownIcon />
            </CustomIconButton>
          ) : (
            <CustomIconButton>
              <ThumbUpIcon />
            </CustomIconButton>
          )}
        </button>
        <CustomTooltip
          likes={likes?.length}
          usernames={likes?.map((like) => like.username)}
        />
        {/* <PostWithComment /> */}
        <IconButton onClick={handleIconClick}>
          <CommentIcon />
        </IconButton>
      </div>
      <PostWithComment showInput={showInput} comment={comment} />
    </div>
  );
};
