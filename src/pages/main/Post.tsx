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
interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[] | null>(null);
  const likesRef = collection(db, "likes");
  const likesDoc = query(likesRef, where("postId", "==", post?.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: post.id, likeId: newDoc.id }]
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
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p className="post-likes"> Likes :{likes?.length}</p>}
      </div>
    </div>
  );
};
