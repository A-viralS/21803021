"use client";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import PostCard from "../../../components/PostCard";
import { fetchLatestPosts } from "../../../lib/api";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);

  const load = async () => {
    const data = await fetchLatestPosts();
    setPosts(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold my-4">Live Feed</h1>
      <div className="space-y-4">
        {posts.map((post: any) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </main>
  );
}
