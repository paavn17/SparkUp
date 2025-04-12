import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../config/firebase";
import { PostType as IPost } from "./main";
import "../../App.css";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

interface Props {
  post: IPost;
  canEdit?: boolean;
  onDelete?: () => void;
}

interface Like {
  likeId: string;
  userId: string;
}

export const Post = ({ post, canEdit, onDelete }: Props) => {
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[]>([]);
  const [animateLike, setAnimateLike] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const likesRef = collection(db, "likes");

  const getLikes = async () => {
    const data = await getDocs(query(likesRef, where("postId", "==", post.id)));
    const likesData = data.docs.map((doc) => ({
      userId: doc.data().userId,
      likeId: doc.id,
    }));
    setLikes(likesData);
  };

  const addLike = async () => {
    if (!user) return;
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user.uid,
        postId: post.id,
      });
      setLikes((prev) => [...prev, { userId: user.uid, likeId: newDoc.id }]);
      setAnimateLike(true);
    } catch (err) {
      console.log("Add like error:", err);
    }
  };

  const removeLike = async () => {
    if (!user) return;
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user.uid)
      );
      const likeToDeleteData = await getDocs(likeToDeleteQuery);

      if (!likeToDeleteData.empty) {
        const likeId = likeToDeleteData.docs[0].id;
        await deleteDoc(doc(db, "likes", likeId));
        setLikes((prev) => prev.filter((like) => like.likeId !== likeId));
        setAnimateLike(true);
      }
    } catch (err) {
      console.log("Remove like error:", err);
    }
  };

  const hasUserLiked = likes.some((like) => like.userId === user?.uid);

  const handleLikeToggle = () => {
    hasUserLiked ? removeLike() : addLike();
  };

  const handleDelete = async () => {
    if (onDelete) onDelete();
  };

  useEffect(() => {
    getLikes();
  }, []);

  useEffect(() => {
    if (animateLike) {
      const timer = setTimeout(() => setAnimateLike(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animateLike]);

  return (
    <div className="post-container bg-[#1c112b] rounded-xl shadow-md p-5 space-y-3 text-white border border-[#32264d] relative">
      {/* Delete Button (Positioned in top-right corner) */}
      {canEdit && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Delete
        </button>
      )}

      {/* Profile section */}
      <div className="flex items-center gap-3">
        <img
          src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${post.userId}`}
          alt={post.usernamee}
          className="w-10 h-10 rounded-full object-cover"
        />
        <Link
          to={`/profile/${post.userId}`}
          className="text-sm font-medium text-gray-300 hover:underline hover:text-violet-300"
        >
          {post.usernamee}
        </Link>
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-100 break-words">
        {post.title}
      </h2>

      {/* Description with line clamp */}
      {showFull ? (
        <p className="text-gray-300 text-sm sm:text-base break-words">
          {post.description}
        </p>
      ) : (
        <p className="text-gray-300 text-sm sm:text-base break-words line-clamp-3">
          {post.description}
        </p>
      )}

      {/* Toggle Read More */}
      {post.description.length > 100 && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-violet-400 hover:underline text-xs"
        >
          {showFull ? "Show less" : "Read more"}
        </button>
      )}

      {/* Like Button */}
      <div className="footer flex items-center gap-2">
        <button
          onClick={handleLikeToggle}
          className={`text-sm font-medium hover:cursor-pointer flex items-center gap-1 ${
            hasUserLiked ? "text-yellow-400" : "text-white"
          } ${animateLike ? "like-animate" : ""}`}
        >
          <Zap
            className={`w-5 h-5 transition-colors duration-300 ${
              hasUserLiked
                ? "fill-yellow-400"
                : "fill-transparent stroke-gray-500"
            }`}
          />
          <span className="text-sm font-extrabold text-yellow-300 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)] uppercase tracking-wide">
            Spark
          </span>
        </button>

        <span className="text-sm text-gray-400">{likes.length}</span>
      </div>
    </div>
  );
};

export default Post;
