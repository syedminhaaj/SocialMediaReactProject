import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";

export const CreateForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    title: yup.string().required("You must enter the title"),
    description: yup.string().required("Description is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const postRef = collection(db, "posts");
  const onCreatePost = async (data: any) => {
    await addDoc(postRef, {
      title: data.title,
      description: data.description,
      username: user?.displayName,
      userId: user?.uid,
    });
    navigate("/");
  };
  return (
    <div className="createPost">
      <form onSubmit={handleSubmit(onCreatePost)}>
        <input placeholder="Enter title.." {...register("title")} />
        <textarea
          placeholder="Enter description.."
          {...register("description")}
        />
        <input className="submitForm" type="submit" />
      </form>
    </div>
  );
};
