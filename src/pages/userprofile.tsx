import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import Post from "./main/post";
import { PostType } from "./main/main";
import { useAuthState } from "react-firebase-hooks/auth";

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const { userid } = useParams<{ userid: string }>();

  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<{
    usernamee: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const postsRef = collection(db, "posts");

  const fetchUserDataAndPosts = async () => {
    try {
      const q = query(postsRef, where("userId", "==", userid));
      const querySnapshot = await getDocs(q);
      const posts: PostType[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as PostType;
        posts.push({ ...data, id: doc.id });
      });

      setUserPosts(posts);

      if (posts.length > 0) {
        setUserData({
            usernamee: posts[0].usernamee,
          } as any); 
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setUserPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const emailPrefix = user?.email?.split("@")[0];

  useEffect(() => {
    fetchUserDataAndPosts();
  }, [userid]);

  const coverImages = [
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&h=256&q=80",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&h=256&q=80",
    "https://images.unsplash.com/photo-1633113083931-c4df26f6b37f?auto=format&fit=crop&w=1200&h=256&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=256&q=80",
    "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&h=256&q=80",
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&h=256&q=80",
  ];

  const randomCover =
    coverImages[Math.floor(Math.random() * coverImages.length)];

  return (
    <div className="text-white mt-8">
      {/* Cover image */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-[#1a001f] to-[#2d004d]">
        <img
          src={randomCover}
          alt="cover"
          className="object-cover w-full h-full"
        />

        {/* Profile image */}
        <div className="absolute left-4 sm:left-10 -bottom-12 sm:-bottom-16">
          <img
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${userid}`}
            alt="profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#1c112b] shadow-lg"
          />
        </div>
      </div>

      {/* Spacer for profile image */}
      <div className="mt-16 sm:mt-20 mb-6 px-4 sm:px-10">
        <h1 className="text-2xl font-bold">
          {userData?.usernamee || emailPrefix}
        </h1>
      </div>

      {/* Posts section */}
      <div className="px-4 sm:px-10">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>

        {loading ? (
          <p className="text-gray-400">Loading posts...</p>
        ) : userPosts.length > 0 ? (
          <div className="space-y-5">
            {userPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                canEdit={user?.uid === userid}
                onDelete={() => handleDeletePost(post.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
