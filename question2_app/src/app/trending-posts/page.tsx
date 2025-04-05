
"use client "
import Navbar from "../../../components/Navbar";
import PostCard from "../../../components/PostCard";
import { fetchTrendingPosts } from "../../../lib/api";

export default async function TrendingPostsPage() {
  const posts = await fetchTrendingPosts();

  return (
    <main className="max-w-3xl mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold my-4">Trending Posts</h1>
      <div className="space-y-4">
        {posts.map((post: any) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </main>
  );
}
