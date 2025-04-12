import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Form = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    title: yup
      .string()
      .required("You must add a title")
      .min(5, "Title must be at least 5 characters long")
      .max(100, "Title must not exceed 100 characters")
      .matches(
        /^[a-zA-Z0-9\s\-.,!?'"()]+$/,
        "Title can only contain letters, numbers, and punctuation"
      ),

    description: yup
      .string()
      .required("You must add a description")
      .min(10, "Description must be at least 10 characters long")
      .max(500, "Description must not exceed 500 characters")
      .matches(
        /^[a-zA-Z0-9\s\-.,!?'"()]+$/,
        "Description can only contain letters, numbers, spaces, and punctuation"
      ),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "posts");
  const emailPrefix = user?.email?.split("@")[0];

  const onCreatePost = async (data: any) => {
    if (loading) return;
    setLoading(true);

    try {
      await addDoc(postsRef, {
        title: data.title,
        description: data.description,
        usernamee: user?.displayName || emailPrefix,
        userId: user?.uid,
      });
      console.log("Post added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onCreatePost)}
      className="w-full max-w-md bg-[#1A102F] shadow-lg rounded-xl p-6 space-y-5 
                 mx-auto mt-10 sm:mt-16 md:mt-24 lg:mt-32 text-white"
    >
      <div>
        <input
          placeholder="Title..."
          {...register("title")}
          className="w-full px-4 py-2 bg-[#2A1C44] border border-[#4B3B71] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-400"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          placeholder="Description"
          {...register("description")}
          rows={4}
          className="w-full px-4 py-2 bg-[#2A1C44] border border-[#4B3B71] text-white rounded-lg resize-none max-h-40 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-400"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Posting..." : "Submit"}
      </button>
    </form>
  );
};

export default Form;
