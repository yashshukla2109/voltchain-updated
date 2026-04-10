import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare, MoreHorizontal, Flag, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DUMMY_POSTS = [
  {
    id: 'dummy-1',
    author: 'Sarah Chen',
    avatar: 'S',
    content: 'Just successfully traded 50 kWh of surplus solar energy! The new automated bidding system on VoltChain is incredibly smooth. Has anyone else tried setting up recurring bids?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    liked: true,
    likes_count: 24,
    replies: [
      {
        id: 'reply-1',
        author: 'Marcus Johnson',
        avatar: 'M',
        content: 'Yes! I set it up last week. It automatically sold my excess capacity during peak hours yesterday. Really good returns.',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      }
    ]
  },
  {
    id: 'dummy-2',
    author: 'Elena Rodriguez',
    avatar: 'E',
    content: 'Looking for advice on optimizing battery storage cycles for the winter months. My current degradation rate seems a bit higher than expected. Any tips from the community?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    liked: false,
    likes_count: 8,
    replies: []
  }
];

const Community = () => {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>(DUMMY_POSTS);
  const [newPost, setNewPost] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

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
    try {
      const { data } = await supabase
        .from("community_posts")
        .select(`
          *,
          community_likes (*)
        `)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        // Map liked status per user
        const mappedPosts = data.map((p: any) => ({
          ...p,
          id: p.id.toString(),
          likes_count: p.community_likes?.length || 0,
          liked: user ? p.community_likes.some((l: any) => l.user_id === user.id) : false,
          replies: [] // Supabase comments logic could go here if exists
        }));
        setPosts([...DUMMY_POSTS, ...mappedPosts]);
      } else {
        setPosts(DUMMY_POSTS);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Add new post
  const handlePost = async () => {
    if (!newPost.trim()) {
      toast.error("Please enter some content");
      return;
    }
    
    // Optimistic UI update or dummy behavior if no user
    const optimisticPost = {
      id: `temp-${Date.now()}`,
      author: user?.email || "Guest User",
      avatar: user?.email ? user.email[0].toUpperCase() : "G",
      content: newPost,
      created_at: new Date().toISOString(),
      liked: false,
      likes_count: 0,
      replies: []
    };

    setPosts([optimisticPost, ...posts]);
    setNewPost("");
    toast.success("Post published successfully");

    if (user) {
      const { data: post } = await supabase
        .from("community_posts")
        .insert([{ author: user.email, avatar: user.email[0].toUpperCase(), content: newPost }])
        .select()
        .single();
      
      if (post) fetchPosts();
    }
  };

  // Like/unlike a post
  const handleLike = async (postId: string, liked: boolean) => {
    // Update UI instantly
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          liked: !liked,
          likes_count: liked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1
        };
      }
      return p;
    }));

    if (!user || postId.startsWith('dummy-') || postId.startsWith('temp-')) return;

    if (liked) {
      await supabase
        .from("community_likes")
        .delete()
        .eq("post_id", parseInt(postId))
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("community_likes")
        .insert([{ post_id: parseInt(postId), user_id: user.id }]);
    }
  };

  const handleReport = (postId: string) => {
    toast.success("Post reported successfully. Our team will review it.");
  };

  const handleHide = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.success("Post hidden from your feed.");
  };

  const toggleReply = (postId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSubmitReply = (postId: string) => {
    const replyText = replyInputs[postId];
    if (!replyText?.trim()) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      author: user?.email || "Guest User",
      avatar: user?.email ? user.email[0].toUpperCase() : "G",
      content: replyText,
      created_at: new Date().toISOString(),
    };

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, replies: [...(p.replies || []), newReply] };
      }
      return p;
    }));

    setReplyInputs(prev => ({ ...prev, [postId]: "" }));
    toast.success("Reply added!");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950">
      <div className="mr-64 p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Community Hub</h1>
            <p className="text-slate-500 mt-2">Connect, trade insights, and discuss energy market trends.</p>
          </div>

          {/* New Post */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">{user ? user.email[0].toUpperCase() : "G"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share an update or ask the community..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="resize-none min-h-[100px] border-slate-200 focus-visible:ring-primary"
                />
                <div className="flex justify-end">
                  <Button onClick={handlePost} className="px-6">
                    Publish Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="p-6 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-100 dark:border-slate-800">
                      <AvatarFallback className="bg-primary/5 text-primary">{post.avatar || post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{post.author}</h4>
                      <span className="text-xs text-slate-500">
                        {new Date(post.created_at).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleHide(post.id)} className="cursor-pointer">
                        <EyeOff className="mr-2 h-4 w-4" />
                        <span>Hide Post</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReport(post.id)} className="text-destructive cursor-pointer focus:text-destructive">
                        <Flag className="mr-2 h-4 w-4" />
                        <span>Report</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="pl-13">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap ml-13">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-2 ${post.liked ? 'text-red-500 hover:text-red-600' : 'text-slate-500'}`}
                      onClick={() => handleLike(post.id, post.liked)}
                    >
                      <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                      <span>{post.likes_count}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 text-slate-500"
                      onClick={() => toggleReply(post.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.replies?.length || 0} Replies</span>
                    </Button>
                  </div>

                  {/* Replies Section */}
                  {expandedReplies[post.id] && (
                    <div className="mt-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-4">
                      {/* Existing Replies */}
                      {post.replies?.map((reply: any) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800">{reply.avatar || reply.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{reply.author}</span>
                              <span className="text-xs text-slate-500">
                                {new Date(reply.created_at).toLocaleDateString(undefined, { 
                                  month: 'short', day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{reply.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div className="flex gap-3 mt-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">{user ? user.email[0].toUpperCase() : "G"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Write a reply..."
                            value={replyInputs[post.id] || ""}
                            onChange={(e) => setReplyInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSubmitReply(post.id);
                            }}
                            className="h-9 text-sm"
                          />
                          <Button size="sm" onClick={() => handleSubmitReply(post.id)} className="h-9">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Community;
