import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateForm } from "./create-form";

export const CreatePost = () => {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const navigate = useNavigate();

  const handleCloseForm = () => {
    navigate("/main");
  };
  return (
    <div>
      <CreateForm post={null} onClose={handleCloseForm} />
    </div>
  );
};
