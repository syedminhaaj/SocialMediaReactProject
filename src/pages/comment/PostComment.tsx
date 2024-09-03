import React, { useState } from "react";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./PostComment.css";

interface IComment {
  comment: any;
  showInput: any;
}
const PostWithComment = (props: IComment) => {
  const [showInput, setShowInput] = useState(false);
  const [comment, setComment] = useState("");

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

  const handleSendClick = () => {
    // Handle the send button click
    console.log("Comment sent:", comment);
    setComment(""); // Optionally clear the input field after sending
  };

  return (
    <div>
      {props.showInput && (
        <TextField
          className="commentInput"
          value={comment}
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
    </div>
  );
};

export default PostWithComment;
