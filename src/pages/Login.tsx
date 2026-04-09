import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient"; // ✅ import supabase client

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error("No user returned");

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") throw profileError; // ignore "no rows found"

    // If profile doesn't exist or required fields empty, redirect to /account
    if (!profile || !profile.first_name || !profile.last_name) {
      toast({
        title: "Complete your profile",
        description: "Please enter your personal information first.",
      });
      navigate("/account");
    } else {
      toast({ title: "Login successful", description: "Welcome back to VoltChain ⚡" });
      navigate("/dashboard");
    }
  } catch (err: any) {
    toast({
      title: "Login failed",
      description: err.message || "Please check your credentials.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen gradient-cosmic flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-12 w-12 text-primary animate-pulse-glow" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              VoltChain
            </h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back to the energy revolution
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border card-shadow animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            <Button
              type="submit"
              className="w-full glow-primary"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
