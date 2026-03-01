import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, Star, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { api } from "@/services/api";

interface Creator {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  profile_image_url: string | null;
  dm_price_usd: string;
}

export default function AudienceDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/creators");
      if (response.data.success) {
        setCreators(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch creators:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token", { path: '/', secure: true, sameSite: 'none' });
    Cookies.remove("refresh_token", { path: '/', secure: true, sameSite: 'none' });
    Cookies.remove("user", { path: '/', secure: true, sameSite: 'none' });
    navigate("/");
  };

  const filteredCreators = creators.filter(
    (c) =>
      c.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-solana-purple to-solana-green flex items-center justify-center">
              <span className="font-bold text-white text-sm">S</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">SolanaConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-4">
              <span className="w-2 h-2 rounded-full bg-solana-green animate-pulse"></span>
              Logged in as <span className="text-foreground font-medium">@{user.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome back, {user.display_name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and connect with your favorite creators on Solana.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-solana-purple/20 flex items-center justify-center text-solana-purple">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Following</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-solana-blue/20 flex items-center justify-center text-solana-blue">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Chats</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-solana-green/20 flex items-center justify-center text-solana-green">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discover Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Discover Creators</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search creators..." 
                className="pl-9 bg-white/5 border-white/10 focus-visible:ring-solana-purple"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-[280px]">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/10" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-4/5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors group flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 border border-white/10">
                          <AvatarImage src={creator.profile_image_url || undefined} />
                          <AvatarFallback className="bg-solana-purple/20 text-solana-purple font-semibold text-lg">
                            {creator.display_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg leading-tight group-hover:text-solana-purple transition-colors">
                            {creator.display_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">@{creator.username}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {creator.bio || "No bio provided yet."}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs font-normal">
                        DM: ${creator.dm_price_usd}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-white/5">
                    <Button className="w-full bg-white text-black hover:bg-white/90 font-medium">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No creators found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search query." : "There are no creators available right now."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
