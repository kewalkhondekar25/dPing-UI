import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"creator" | "audience">("audience");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    display_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        ...formData,
        role,
      });

      if (response.data.success) {
        const { user, tokens } = response.data.data;
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "creator") {
          navigate("/dashboard/creator");
        } else {
          navigate("/dashboard/audience");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-solana-green/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob -z-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-solana-purple to-solana-green flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">d</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">dPing</span>
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Join dPing to connect and monetize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="audience" onValueChange={(v) => setRole(v as any)} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-white/10">
                <TabsTrigger value="audience" className="data-[state=active]:bg-solana-green/20 data-[state=active]:text-solana-green">Audience</TabsTrigger>
                <TabsTrigger value="creator" className="data-[state=active]:bg-solana-purple/20 data-[state=active]:text-solana-purple">Creator</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-white/10 focus-visible:ring-solana-green"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    placeholder="John Doe"
                    value={formData.display_name}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-white/10 focus-visible:ring-solana-green"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-white/10 focus-visible:ring-solana-green"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-white/10 focus-visible:ring-solana-green"
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full text-white font-semibold ${
                  role === 'creator' 
                    ? 'bg-gradient-to-r from-solana-purple to-solana-blue' 
                    : 'bg-gradient-to-r from-solana-green to-solana-blue'
                } hover:opacity-90`}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-solana-blue hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
