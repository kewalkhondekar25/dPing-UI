import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { api } from "@/services/api";
import { Wallet, AlertCircle } from "lucide-react";

const LAMPORTS_PER_SOL = 1_000_000_000;

const lamportsToSolDisplay = (lamports: string | number | null | undefined): string => {
  if (lamports == null || lamports === "") return "0";
  const numericLamports = Number(lamports);
  if (!Number.isFinite(numericLamports)) return "0";
  const solValue = numericLamports / LAMPORTS_PER_SOL;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 9,
  }).format(solValue);
};

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { publicKey } = useWallet();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateWalletAddress, setUpdateWalletAddress] = useState(false);
  const [totalEarningsLamports, setTotalEarningsLamports] = useState<string | null>(null);
  const [activeConnectionsCount, setActiveConnectionsCount] = useState<number>(0);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    dm_price_lamports: '',
    profile_image_url: ''
  });

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({
        username: parsed.username || '',
        display_name: parsed.display_name || '',
        bio: parsed.bio || '',
        dm_price_lamports: lamportsToSolDisplay(parsed.dm_price_lamports),
        profile_image_url: parsed.profile_image_url || ''
      });
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setEarningsLoading(true);
        setTransactionsLoading(true);
        // Fetch earnings
        const res = await api.get('/payments/earnings');
        if (res.data?.success && res.data?.data != null) {
          const data = res.data.data;
          const lamports = data?.total_earnings_lamports / 1_000_000_000;
          if (lamports != null) setTotalEarningsLamports(String(lamports));
        }

        // Fetch active connections count
        const countRes = await api.get('/dashboard/connections/count');
        if (countRes.data?.success) {
          setActiveConnectionsCount(countRes.data.data.count);
        }

        // Fetch incoming payments / transactions
        const txRes = await api.get('/payments/incoming');
        if (txRes.data?.success && Array.isArray(txRes.data.data)) {
          setTransactions(txRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setEarningsLoading(false);
        setTransactionsLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      
      const dmPriceSOL = parseFloat(formData.dm_price_lamports); // Here it acts as SOL value in UI input
      let submitData = { ...formData };
      
      if (!isNaN(dmPriceSOL)) {
        // Convert the SOL input to lamports string to match the updated backend expectation
        const lamports = Math.round(dmPriceSOL * LAMPORTS_PER_SOL).toString();
        submitData = { ...formData, dm_price_lamports: lamports } as any;
      }
      
      const res = await api.patch('/users/creator/profile', submitData);
      
      let walletUpdated = false;
      let newWalletAddress = user.wallet_address;
      
      if (updateWalletAddress && publicKey) {
        const walletRes = await api.patch('/users/wallet', { wallet_address: publicKey.toString() });
        if (walletRes.data.success) {
          walletUpdated = true;
          newWalletAddress = publicKey.toString();
        }
      }

      if (res.data.success || walletUpdated) {
        // Keep dm_price_lamports in lamports for consistency with backend contract and display logic.
        const updatedUser = { ...user, ...formData, dm_price_lamports: submitData.dm_price_lamports, wallet_address: newWalletAddress };
        setUser(updatedUser);
        Cookies.set("user", JSON.stringify(updatedUser), { path: '/', secure: true, sameSite: 'none' });
        setIsEditing(false);
        setUpdateWalletAddress(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token", { path: '/', secure: true, sameSite: 'none' });
    Cookies.remove("refresh_token", { path: '/', secure: true, sameSite: 'none' });
    Cookies.remove("user", { path: '/', secure: true, sameSite: 'none' });
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-2">
              <span className="w-2 h-2 rounded-full bg-solana-green animate-pulse"></span>
              Logged in as <span className="text-foreground font-medium">@{user.username}</span>
            </div>
            <WalletMultiButton style={{ backgroundColor: 'transparent', border: '1px solid #9945FF', color: '#9945FF', fontSize: '14px', height: '36px', padding: '0 16px', borderRadius: '6px' }}>
              {publicKey ? undefined : 'Connect Wallet'}
            </WalletMultiButton>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome back, {user.display_name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and connect with your favorite creators on Solana.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 relative">
          {!isEditing ? (
            <>
              <div className="absolute top-6 right-6">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              <h2 className="text-xl font-semibold mb-4">Welcome, {user.display_name}!</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Username:</span> @{user.username}
                </div>
                <div>
                  <span className="font-medium text-foreground">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium text-foreground">DM Price:</span> {lamportsToSolDisplay(user.dm_price_lamports)} SOL
                </div>
                <div>
                  <span className="font-medium text-foreground">Status:</span> {user.is_active ? "Active" : "Inactive"}
                </div>
                {user.bio && (
                  <div className="col-span-2 mt-2">
                    <span className="font-medium text-foreground">Bio:</span> {user.bio}
                  </div>
                )}
                {user.wallet_address && (
                  <div className="col-span-2 mt-2">
                    <span className="font-medium text-foreground">Receiving Wallet:</span> <span className="font-mono text-xs">{user.wallet_address}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input 
                    value={formData.display_name} 
                    onChange={e => setFormData({...formData, display_name: e.target.value})} 
                    placeholder="Display Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                    placeholder="Username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">DM Price (SOL)</label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.dm_price_lamports} 
                    onChange={e => setFormData({...formData, dm_price_lamports: e.target.value})} 
                    placeholder="e.g. 0.05"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Image URL</label>
                  <Input 
                    value={formData.profile_image_url} 
                    onChange={e => setFormData({...formData, profile_image_url: e.target.value})} 
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.bio} 
                    onChange={e => setFormData({...formData, bio: e.target.value})} 
                    placeholder="Tell your audience about yourself..."
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2 mt-4 p-5 border border-solana-purple/20 rounded-xl bg-gradient-to-r from-solana-purple/5 to-transparent">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-full bg-solana-purple/10 text-solana-purple">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Receiving Wallet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This is the Solana address where you will receive all DM payments and tips from your audience. Please ensure this is correct.
                      </p>

                      {publicKey ? (
                        <div className="space-y-3 bg-background/50 p-4 rounded-lg border border-white/5">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              id="updateWallet" 
                              className="w-4 h-4 rounded border-white/20 bg-background text-solana-purple focus:ring-solana-purple focus:ring-offset-background disabled:opacity-50"
                              checked={updateWalletAddress}
                              onChange={(e) => setUpdateWalletAddress(e.target.checked)}
                              disabled={user?.wallet_address === publicKey.toString()}
                            />
                            <label htmlFor="updateWallet" className={`text-sm font-medium ${user?.wallet_address === publicKey.toString() ? 'opacity-70' : 'cursor-pointer'}`}>
                              {user?.wallet_address === publicKey.toString() 
                                ? "Your connected wallet is already set as your receiving address."
                                : "Set my currently connected wallet as my receiving address."
                              }
                            </label>
                          </div>
                          {!user?.wallet_address || user.wallet_address !== publicKey.toString() ? (
                            <div className="pl-7">
                              <code className="text-xs px-2 py-1 rounded bg-solana-purple/10 text-solana-purple border border-solana-purple/20">
                                {publicKey.toString()}
                              </code>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-amber-500/90 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Connect your wallet using the button at the top right to set or update your receiving address.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-solana-green">
                {earningsLoading ? '…' : totalEarningsLamports ? totalEarningsLamports : '0.00'} SOL
              </p>
            </div>
            <div className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center" onClick={() => navigate('/chat/creator')}>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Active Connections</h3>
              <p className="text-3xl font-bold text-solana-purple">{activeConnectionsCount}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Profile Views</h3>
              <p className="text-3xl font-bold text-solana-blue">0</p>
            </div>
          </div>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Transactions</h2>
            </div>
            {transactionsLoading ? (
              <p className="text-sm text-muted-foreground">Loading transactions…</p>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions found yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Audience</th>
                      <th className="py-2 pr-4">Amount (SOL)</th>
                      <th className="py-2 pr-4">Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => {
                      const amountSol = tx?.amount_lamports
                        ? Number(tx.amount_lamports) / 1_000_000_000
                        : 0;
                      const audienceName =
                        tx?.audience?.display_name ||
                        tx?.audience?.username ||
                        'Unknown';
                      const date = tx?.paid_at
                        ? new Date(tx.paid_at).toLocaleDateString()
                        : '-';
                      const explorerUrl = tx?.transaction_id
                        ? `https://explorer.solana.com/tx/${tx.transaction_id}?cluster=devnet`
                        : undefined;

                      return (
                        <tr key={tx.id} className="border-b border-white/5 last:border-0">
                          <td className="py-2 pr-4 whitespace-nowrap">{date}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{audienceName}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">
                            {amountSol}
                          </td>
                          <td className="py-2 pr-4 whitespace-nowrap">
                            {explorerUrl ? (
                              <a
                                href={explorerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-solana-blue hover:underline break-all"
                              >
                                {tx.transaction_id}
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
