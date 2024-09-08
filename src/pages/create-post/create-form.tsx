import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db, storage } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
interface FormProps {
  post?: any;
  onClose: () => void;
}

export const CreateForm = ({ post, onClose }: FormProps) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const postRef = collection(db, "posts");
  const storageRef = image ? ref(storage, `images/${image.name}`) : null;

  const schema = yup.object().shape({
    title: yup.string().required("You must enter the title"),
    description: yup.string().required("Description is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("description", post.description);
    }
  }, [post, setValue]);

  const handleChangeImage = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onCreatePost = async (data: any) => {
    try {
      if (post) {
        // Editing an existing post
        const postDoc = doc(db, "posts", post.id);
        if (image) {
          const uploadTask = uploadBytesResumable(storageRef!, image);
          await uploadTask;
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(postDoc, {
            title: data.title,
            description: data.description,
            imageUrl: url,
            time: serverTimestamp(),
          });
        } else {
          await updateDoc(postDoc, {
            title: data.title,
            description: data.description,
            time: serverTimestamp(),
          });
        }
      } else {
        // Creating a new post
        if (image) {
          const uploadTask = uploadBytesResumable(storageRef!, image);
          await uploadTask;
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(postRef, {
            title: data.title,
            description: data.description,
            username: user?.displayName,
            userId: user?.uid,
            photoUrl: auth.currentUser?.photoURL,
            imageUrl: url,
            time: serverTimestamp(),
          });
        }
      }
      navigate("/main");
    } catch (error) {
      console.error("Error handling post:", error);
    }
    onClose();
  };

  return (
    <div className="post-container">
      <form onSubmit={handleSubmit(onCreatePost)}>
        <input placeholder="Enter title.." {...register("title")} required />
        <textarea
          placeholder="Enter description.."
          {...register("description")}
          required
        />
        <input type="file" accept="image/*" onChange={handleChangeImage} />
        <input className="submitForm" type="submit" />
        <input
          className="cancel-button"
          type="button"
          value="Cancel"
          onClick={onClose} // Ensure you define this function
        />
      </form>
    </div>
  );
};
