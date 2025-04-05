// index.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzODM0MDI3LCJpYXQiOjE3NDM4MzM3MjcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImU3YzE3Y2I1LWVhYzEtNDZhZi1hYTU3LTFkZjMyNjQ1ODc3NyIsInN1YiI6InNvbmlhdmlyYWwxNEBnbWFpbC5jb20ifSwiZW1haWwiOiJzb25pYXZpcmFsMTRAZ21haWwuY29tIiwibmFtZSI6ImF2aXJhbCBzb25pIiwicm9sbE5vIjoiMjE4MDMwMjEiLCJhY2Nlc3NDb2RlIjoiU3JNUXFSIiwiY2xpZW50SUQiOiJlN2MxN2NiNS1lYWMxLTQ2YWYtYWE1Ny0xZGYzMjY0NTg3NzciLCJjbGllbnRTZWNyZXQiOiJNWFlRS3JtTmNjeHVtcUFSIn0.iSXxWw-bxnSnF8_jEccnZUMSUVUycLVOiksU1iwaN3o';

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const COMMENTS_BASE_URL = 'http://28.244.56.144/evaluation-service';

// i am assuming i can use 60 seconds as the cache time to live (TTL) for the cache
// Cache implementation
const cache = new Map();
function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}
function getCache(key, ttl = 60000) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data;
  }
  return null;
}

// GET /users - Top 5 users by post count
app.get('/users', async (req, res) => {
  try {
    const cached = getCache('topUsers');
    if (cached) return res.json(cached);

    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const users = usersResponse.data.users;
    const userPostCounts = [];

    const userIds = Object.keys(users);

    const fetchPosts = userIds.map(async (id) => {
      const response = await axios.get(`${BASE_URL}/users/${id}/posts`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      const count = response.data.posts.length;
      userPostCounts.push({ id, name: users[id], count });
    });

    await Promise.all(fetchPosts);

    const topUsers = userPostCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setCache('topUsers', topUsers);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching top users', details: err.message });
  }
});

// GET /posts?type=popular|latest
app.get('/posts', async (req, res) => {
  const { type } = req.query;
  if (!['popular', 'latest'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Use type=popular or type=latest' });
  }

  try {
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const users = usersResponse.data.users;
    const userIds = Object.keys(users);

    const allPosts = [];

    const fetchPosts = userIds.map(async (id) => {
      const response = await axios.get(`${BASE_URL}/users/${id}/posts`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      allPosts.push(...response.data.posts);
    });

    await Promise.all(fetchPosts);

    if (type === 'latest') {
      const latestPosts = allPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
      return res.json(latestPosts);
    } else {
      const postCommentCounts = [];

      const fetchComments = allPosts.map(async (post) => {
        const response = await axios.get(`${COMMENTS_BASE_URL}/posts/${post.id}/comments`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });
        const count = response.data.comments.length;
        postCommentCounts.push({ ...post, commentCount: count });
      });

      await Promise.all(fetchComments);

      const maxCount = Math.max(...postCommentCounts.map((p) => p.commentCount));
      const popularPosts = postCommentCounts.filter((p) => p.commentCount === maxCount);

      return res.json(popularPosts);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
