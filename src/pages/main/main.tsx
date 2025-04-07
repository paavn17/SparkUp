import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import Post from "./post";

export interface PostType {
  id: string;
  userId: string;
  title: string;
  usernamee: string;
  description: string;
}

const Main = () => {
  const [postsList, setPostsList] = useState<PostType[]>([]);

  useEffect(() => {
    const postsRef = collection(db, "posts");

    // Set up a real-time subscription
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as PostType[];
      setPostsList(posts);
    }, (error) => {
      console.error("Error fetching posts:", error);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-24 space-y-6 px-4">
      {postsList.length ? (
        postsList.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p className="text-center">No posts available.</p>
      )}
    </div>
  );
};

export default Main;
