import React, { useEffect, useState } from "react";
import { query, addDoc, collection, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { IconButton, TextField, InputAdornment, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./PostComment.css";
import { useAuthState } from "react-firebase-hooks/auth";

interface IComment {
  comment: any;
  showInput: any;
  postId: string;
  onCommentCountChange: (count: number) => void;
}

interface Comment {
  postId: string;
  username: string;
  commentDesc: string;
  userId: string;
}
const PostWithComment = (props: IComment) => {
  const [user] = useAuthState(auth);
  const [showInput, setShowInput] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentDesc, setCommentDesc] = useState("");
  const [showComments, setShowComments] = useState(false);

  const commentDbRef = collection(db, "comments");
  const commentsDoc = query(commentDbRef, where("postId", "==", props.postId));

  const handleInputChange = (event: any) => {
    setCommentDesc(event.target.value);
  };

  const handleInputBlur = () => {
    setShowInput(false);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const getAllComments = async () => {
    const data = await getDocs(commentsDoc);
    const commentsData = data.docs.map((doc) => ({
      userId: doc.data().userId,
      postId: props.postId,
      username: doc.data().username,
      commentDesc: doc.data().commentDesc,
    }));
    setComments(commentsData);
    props.onCommentCountChange(commentsData.length);
  };

  const handleSendClick = async () => {
    if (commentDesc.trim() === "") return;
    await addDoc(commentDbRef, {
      commentDesc: commentDesc,
      postId: props.postId,
      userId: user?.uid,
      username: user?.displayName,
    });
    setCommentDesc(""); // Clear the input field after sending the comment
    //getAllComments();
  };

  useEffect(() => {
    getAllComments();
  }, []);
  return (
    <div>
      {props.showInput && (
        <TextField
          className="commentInput"
          value={commentDesc}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="Add a comment..."
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSendClick} edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
      {comments && comments.length > 0 && (
        <Button onClick={handleToggleComments} variant="text" color="primary">
          {showComments ? "Hide Comments" : "Load Comments"}
        </Button>
      )}
      {showComments &&
        comments?.map((comment, index) => (
          <div className="comment">
            <span className="username">{comment.username}</span>
            <p className="comment-text">{comment.commentDesc}</p>
          </div>
        ))}
    </div>
  );
};

export default PostWithComment;
