import React, { useEffect, useState } from "react";
import {
  query,
  addDoc,
  collection,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import {
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Modal,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./PostComment.css";
import { useAuthState } from "react-firebase-hooks/auth";
import ConfirmationModal from "../../Common-Utils/ConfirmationModal";

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
  id: string;
  photoUrl: string;
}

const PostWithComment = (props: IComment) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentDesc, setCommentDesc] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null); // To track the comment being edited
  const [editedCommentText, setEditedCommentText] = useState<string>(""); // For editing
  const [showComments, setShowComments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // For delete confirmation
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null); // Track comment to delete

  const commentDbRef = collection(db, "comments");
  const commentsDoc = query(commentDbRef, where("postId", "==", props.postId));

  const getAllComments = async () => {
    const data = await getDocs(commentsDoc);
    const commentsData = data.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId,
      postId: props.postId,
      username: doc.data().username,
      commentDesc: doc.data().commentDesc,
      photoUrl: doc.data().photoUrl,
    }));
    setComments(commentsData);
    props.onCommentCountChange(commentsData.length);
  };

  const handleInputChange = (event: any) => {
    setCommentDesc(event.target.value);
  };

  const handleSendClick = async () => {
    if (commentDesc.trim() === "") return;
    await addDoc(commentDbRef, {
      commentDesc: commentDesc,
      postId: props.postId,
      userId: user?.uid,
      username: user?.displayName,
      photoUrl: auth.currentUser?.photoURL || "",
    });
    setCommentDesc(""); // Clear input
    getAllComments();
  };

  // Handle edit comment logic
  const handleEditClick = (commentId: string, commentText: string) => {
    setEditingComment(commentId);
    setEditedCommentText(commentText);
  };

  const handleSaveEdit = async (commentId: string) => {
    const commentDoc = doc(db, "comments", commentId);
    await updateDoc(commentDoc, { commentDesc: editedCommentText });
    setEditingComment(null); // Stop editing
    getAllComments();
  };

  // Handle delete comment logic
  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete) {
      const commentDoc = doc(db, "comments", commentToDelete);
      await deleteDoc(commentDoc);
      setShowDeleteModal(false);
      setCommentToDelete(null);
      getAllComments();
    }
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
        <Button
          onClick={() => setShowComments(!showComments)}
          variant="text"
          color="primary"
        >
          {showComments ? "Hide Comments" : "Load Comments"}
        </Button>
      )}

      {showComments &&
        comments?.map((comment) => (
          <div key={comment.id} className="comment">
            {editingComment === comment.id ? (
              <TextField
                value={editedCommentText}
                onChange={(e) => setEditedCommentText(e.target.value)}
                fullWidth
              />
            ) : (
              <>
                <img
                  src={comment?.photoUrl || ""}
                  className="commentImg"
                  width="20"
                  height="20"
                />
                <span className="username">{comment.username}</span>
                <p className="comment-text">{comment.commentDesc}</p>
              </>
            )}

            {user?.uid === comment.userId && (
              <div className="comment-actions">
                {editingComment === comment.id ? (
                  <Button
                    onClick={() => handleSaveEdit(comment.id)}
                    color="primary"
                  >
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() =>
                        handleEditClick(comment.id, comment.commentDesc)
                      }
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(comment.id)}
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

      <ConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this post?"
      />
    </div>
  );
};

export default PostWithComment;
