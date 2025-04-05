const BASE_URL = "http://localhost:3001";

export const fetchTopUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const fetchTrendingPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts?type=popular`);
  return res.json();
};

export const fetchLatestPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts?type=latest`);
  return res.json();
};
