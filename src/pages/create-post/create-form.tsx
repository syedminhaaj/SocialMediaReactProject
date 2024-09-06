import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db, storage } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { useState } from "react";

export const CreateForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const schema = yup.object().shape({
    title: yup.string().required("You must enter the title"),
    description: yup.string().required("Description is required"),
    //I'm not using this yup for images currently
    // image: yup
    //   .mixed()
    //   .required("Image is required")
    //   .test("fileSize", "File is too large", (value: any) => {
    //     return value && value.size <= 2 * 1024 * 1024; // 2MB file size limit
    //   })
    //   .test("fileType", "Unsupported file format", (value: any) => {
    //     return value && ["image/jpeg", "image/png"].includes(value.type);
    //   }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const handleChangeImage = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const postRef = collection(db, "posts");
  const storageRef = ref(storage, `images/${image?.name}`);

  const onCreatePost = async (data: any) => {
    if (image) {
      const uploadTask = uploadBytesResumable(storageRef, image);
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

    navigate("/main");
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
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
          required
        />
        <input className="submitForm" type="submit" />
      </form>
    </div>
  );
};
