type Post = {
    id: number;
    title: string;
    body: string;
    commentCount?: number;
  };
  
  export default function PostCard({ id, title, body, commentCount }: Post) {
    const imageUrl = `https://source.unsplash.com/random/300x200?sig=${id}`;
  
    return (
      <div className="bg-white shadow p-4 rounded-xl">
        <img src={imageUrl} className="rounded-md w-full h-48 object-cover mb-3" />
        <h2 className="font-bold text-xl">{title}</h2>
        <p className="text-gray-700">{body}</p>
        {commentCount !== undefined && (
          <p className="mt-2 text-sm text-blue-600 font-medium">{commentCount} comments</p>
        )}
      </div>
    );
  }
  