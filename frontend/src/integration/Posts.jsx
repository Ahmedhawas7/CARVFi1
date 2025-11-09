import { useState, useEffect } from "react";
import { createPost, likePost } from "./integration/socialClient";

export default function Posts({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");

  async function fetchPosts() {
    setPosts([]); // مؤقتًا مصفوفة فارغة أو استدعاء بيانات من SVM
  }

  async function handlePostSubmit() {
    await createPost(currentUser.id, newPostContent);
    setNewPostContent("");
    fetchPosts();
  }

  async function handleLike(postId) {
    await likePost(postId, currentUser.id);
    fetchPosts();
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <input
        type="text"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        placeholder="Write your post..."
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handlePostSubmit}
        className="bg-blue-500 text-white p-2 mt-2 rounded"
      >
        Post
      </button>

      <div className="mt-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-2 rounded mt-2">
            <p>{post.content}</p>
            <button
              onClick={() => handleLike(post.id)}
              className="bg-green-500 text-white p-1 rounded mt-1"
            >
              like
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
