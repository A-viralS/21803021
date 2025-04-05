"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-md ${pathname === path ? "bg-blue-600 text-white" : "bg-gray-100"}`;

  return (
    <nav className="flex justify-center gap-4 py-4 border-b">
      <Link className={linkClasses("/top-users")} href="/top-users">Top Users</Link>
      <Link className={linkClasses("/trending-posts")} href="/trending-posts">Trending Posts</Link>
      <Link className={linkClasses("/feed")} href="/feed">Feed</Link>
    </nav>
  );
}
