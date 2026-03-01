import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AudienceDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "audience") {
      navigate("/dashboard/creator");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fan Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.display_name}!</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Username:</span> @{user.username}
            </div>
            <div>
              <span className="font-medium text-foreground">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium text-foreground">Status:</span> {user.is_active ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Spent</h3>
            <p className="text-3xl font-bold text-solana-green">0 SOL</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Active Connections</h3>
            <p className="text-3xl font-bold text-solana-purple">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
