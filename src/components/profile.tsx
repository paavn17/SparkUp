import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Post from "../pages/main/post"; // make sure this path is correct
import { PostType } from "../pages/main/main"; // adjust this import if needed

const Profile = () => {
  const [user] = useAuthState(auth);
  const [myPosts, setMyPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const getMyPosts = async () => {
      if (user) {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const postsArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as PostType[];
        setMyPosts(postsArray);
      }
    };
    getMyPosts();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={user.photoURL || `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.uid}`}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <hr className="mb-6" />

      <h3 className="text-xl font-semibold mb-4">My Posts</h3>
      <div className="space-y-4">
        {myPosts.length === 0 ? (
          <p className="text-gray-500">You haven't posted anything yet.</p>
        ) : (
          myPosts.map(post => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Profile;
