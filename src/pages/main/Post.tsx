import { Post as IPost } from "./main";
import { auth, db } from "../../config/firebase";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
interface Props {
  post: IPost;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likeAmount, setLikeAmount] = useState<number | null>(null);
  const likesRef = collection(db, "likes");
  const likesDoc = query(likesRef, where("postId", "==", post?.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLikeAmount(data.docs.length);
  };

  const addLike = async () => {
    await addDoc(likesRef, {
      usedId: user?.uid,
      postId: post.id,
    });
  };

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
        <button onClick={addLike}> &#128077;</button>
        {likeAmount && <p className="post-likes"> Likes :{likeAmount}</p>}
      </div>
    </div>
  );
};
