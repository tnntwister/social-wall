import { BskyAgent } from '@atproto/api';
import { useState, useEffect } from 'react';

const BLUESKY_HANDLE = import.meta.env.VITE_BLUESKY_HANDLE;
const BLUESKY_PASSWORD = import.meta.env.VITE_BLUESKY_PASSWORD;

const agent = new BskyAgent({
    service: 'https://bsky.social'
});

const SocialWall = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostThread = async (uri) => {
            const { data } = await agent.getPostThread({ uri, depth: 1 });
            return data.thread;
        };

        const fetchBlueskyPosts = async () => {
            try {
                await agent.login({
                    identifier: BLUESKY_HANDLE,
                    password: BLUESKY_PASSWORD
                });

                const { data } = await agent.getAuthorFeed({
                    actor: BLUESKY_HANDLE,
                    limit: 30
                });

                const postsWithThreads = await Promise.all(
                    data.feed.map(async (item) => {
                        const thread = await fetchPostThread(item.post.uri);
                        return {
                            id: item.post.uri,
                            content: item.post.record.text,
                            timestamp: new Date(item.post.indexedAt).toLocaleString(),
                            author: item.post.author.displayName || BLUESKY_HANDLE,
                            replies: thread.replies?.map(reply => ({
                                id: reply.post.uri,
                                content: reply.post.record.text,
                                author: reply.post.author.displayName,
                                timestamp: new Date(reply.post.indexedAt).toLocaleString()
                            })) || []
                        };
                    })
                );

                setPosts(postsWithThreads);
            } catch (err) {
                setError("Erreur Bluesky: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlueskyPosts();
    }, []);

    if (loading) return <div className="text-center p-4">Chargement...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="grid gap-4 p-4">
            {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow p-4">
                    <div className="font-bold text-gray-700">{post.author}</div>
                    <div className="text-sm text-gray-500">{post.timestamp}</div>
                    <div className="mt-2">{post.content}</div>
                    
                    {post.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                            {post.replies.map(reply => (
                                <div key={reply.id} className="mt-2">
                                    <div className="font-semibold text-gray-600">{reply.author}</div>
                                    <div className="text-xs text-gray-500">{reply.timestamp}</div>
                                    <div className="mt-1">{reply.content}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SocialWall;
