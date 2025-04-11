import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import Post from "./main/post";
import { PostType } from "./main/main";

const UserProfile = () => {
  const { userid } = useParams<{ userid: string }>();

  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<{ usernamee: string; email: string } | null>(null);
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
          email: posts[0].email,
        });
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDataAndPosts();
  }, [userid]);

  return (
    <div className="text-white mt-8" >
      {/* Cover image */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-[#1a001f] to-[#2d004d]">
        <img
          src="https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=1200&q=80"
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
        <h1 className="text-2xl font-bold">{userData?.usernamee || "User"}</h1>
        {/* Optionally: <p className="text-gray-400 text-sm">{userData?.email}</p> */}
      </div>

      {/* Posts section */}
      <div className="px-4 sm:px-10">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>

        {loading ? (
          <p className="text-gray-400">Loading posts...</p>
        ) : userPosts.length > 0 ? (
          <div className="space-y-5">
            {userPosts.map((post) => (
              <Post key={post.id} post={post} />
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
