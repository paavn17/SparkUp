// src/components/Post.tsx
import { useState } from "react";
import { PostType } from "./main";

interface Props {
  post: PostType;
}

const Post = ({ post }: Props) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    // Optional: Firestore logic can go here
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-5 space-y-3 mx-auto">
      {/* Profile section */}
      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt={post.usernamee}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-800">
          {post.usernamee}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
        {post.title}
      </h2>

      {/* Description */}
      <p className="text-gray-700 text-sm sm:text-base">{post.description}</p>

      {/* Like Button */}
      <button
        onClick={toggleLike}
        className={`flex items-center gap-1 text-sm font-medium ${
          liked ? "text-red-500" : "text-gray-500"
        }`}
      >
        {liked ? "❤️" : "🤍"} Like
      </button>
    </div>
  );
};

export default Post;
