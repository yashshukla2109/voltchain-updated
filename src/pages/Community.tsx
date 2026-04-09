import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Community = () => {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Fetch posts with comments and likes
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select(`
        *,
        community_comments (*),
        community_likes (*)
      `)
      .order("created_at", { ascending: false });

    if (data) {
      // Map liked status per user
      const mappedPosts = data.map((p: any) => ({
        ...p,
        liked: user ? p.community_likes.some((l: any) => l.user_id === user.id) : false,
      }));
      setPosts(mappedPosts);
    }
  };

  // Add new post
  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    const { data: post } = await supabase
      .from("community_posts")
      .insert([{ author: user.email, avatar: user.email[0].toUpperCase(), content: newPost }])
      .select()
      .single();

    if (post) setPosts([post, ...posts]);
    setNewPost("");
  };

  // Like/unlike a post
  const handleLike = async (postId: number, liked: boolean) => {
    if (!user) return;

    if (liked) {
      // Remove like
      await supabase
        .from("community_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      // Add like
      await supabase
        .from("community_likes")
        .insert([{ post_id: postId, user_id: user.id }])
        .select()
        .single();
    }

    fetchPosts(); // Refresh posts to update likes
  };

  // Add comment
  const handleAddComment = async (postId: number) => {
    if (!user) return;
    const text = commentText[postId]?.trim();
    if (!text) return;

    const { data: comment } = await supabase
      .from("community_comments")
      .insert([{ post_id: postId, author: user.email, text }])
      .select()
      .single();

    if (comment) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, community_comments: [...p.community_comments, comment] }
            : p
        )
      );
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  return (
    <div className="min-h-screen gradient-cosmic">
      <div className="mr-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* New Post */}
          <Card className="p-6 mb-6">
            <Textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Button className="w-full mt-2" onClick={handlePost}>
              Post
            </Button>
          </Card>

          {/* Posts */}
          {posts.map((post) => (
            <Card key={post.id} className="p-6 mb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarFallback>{post.avatar || post.author[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h4>{post.author}</h4>
                    <span>{new Date(post.created_at).toLocaleString()}</span>
                  </div>
                  <p>{post.content}</p>

                  <div className="flex items-center gap-6 my-2">
                    <button onClick={() => handleLike(post.id, post.liked)}>
                      <Heart className={post.liked ? "fill-red-500" : ""} />
                      {post.community_likes?.length || 0}
                    </button>
                    <span>{post.community_comments?.length || 0}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ""}
                      onChange={(e) =>
                        setCommentText({ ...commentText, [post.id]: e.target.value })
                      }
                    />
                    <Button size="sm" onClick={() => handleAddComment(post.id)}>
                      Post
                    </Button>
                  </div>

                  {/* Show comments */}
                  {post.community_comments?.map((c) => (
                    <div key={c.id} className="flex gap-2 text-sm mt-2">
                      <span className="font-semibold">{c.author}:</span>
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Community;
