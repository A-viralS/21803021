import Navbar from "../../../components/Navbar";
import UserCard from "../../../components/UserCard";
import { fetchTopUsers } from "../../../lib/api";

export default async function TopUsersPage() {
  const users = await fetchTopUsers();

  return (
    <main className="max-w-3xl mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold my-4">Top Users</h1>
      <div className="space-y-4">
      {users && users.length > 0 ? (
  users.map((user: any) => (
    <UserCard key={user.id} {...user} />
  ))
) : (
  <p>No users found.</p>
)}

      </div>
    </main>
  );
}
