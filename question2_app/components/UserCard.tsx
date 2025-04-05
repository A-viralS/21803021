type UserCardProps = {
    id: string;
    name: string;
    count: number;
  };
  
  export default function UserCard({ id, name, count }: UserCardProps) {
    const imageUrl = `https://i.pravatar.cc/150?u=${id}`;
  
    return (
      <div className="bg-white shadow p-4 rounded-xl flex gap-4 items-center">
        <img src={imageUrl} className="w-16 h-16 rounded-full" />
        <div>
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-gray-500">{count} posts</p>
        </div>
      </div>
    );
  }
  