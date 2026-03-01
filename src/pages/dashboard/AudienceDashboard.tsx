import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, Star, TrendingUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Creator {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  profile_image_url: string | null;
  dm_price_lamports: string;
  wallet_address: string | null;
}

export default function AudienceDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const handleConnectClick = (creator: Creator) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first", {
        description: "You need a Solana wallet to connect with creators."
      });
      return;
    }
    
    if (!creator.wallet_address) {
      toast.error("Creator unavailable", {
        description: "This creator hasn't set up their receiving wallet yet."
      });
      return;
    }
    
    setSelectedCreator(creator);
    setIsPaymentModalOpen(true);
  };
  
  const handlePayment = async () => {
    if (!publicKey || !selectedCreator || !selectedCreator.wallet_address) return;
    
    try {
      setIsProcessingPayment(true);
      
      const amountLamportsStr = selectedCreator.dm_price_lamports || "0";
      const amountLamports = parseInt(amountLamportsStr, 10);
      
      if (isNaN(amountLamports) || amountLamports <= 0) {
        throw new Error("Invalid payment amount.");
      }
      
      const fromPubkeyObj = new PublicKey(publicKey.toString());
      const toPubkeyObj = new PublicKey(selectedCreator.wallet_address);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPubkeyObj,
          toPubkey: toPubkeyObj,
          lamports: BigInt(amountLamportsStr) as any, // Need to cast as any because type defs in older web3.js versions clash with strict TS
        })
      );
      
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();
      
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkeyObj;
      
      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      
      const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }
      
      const res = await api.post('/payments/record', {
        creator_id: selectedCreator.id,
        amount_lamports: amountLamports.toString(),
        transaction_id: signature
      });
      
      if (res.data?.success || res.status === 200 || res.status === 201) {
        toast.success("Payment successful!", {
          description: `You can now message ${selectedCreator.display_name}.`
        });
        setIsPaymentModalOpen(false);
      } else {
        throw new Error("Failed to record payment on the server.");
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast.error("Payment failed", {
        description: error?.message || "There was an issue processing your transaction."
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
                <p className="text-2xl font-bold">0.00 SOL</p>
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
                        DM: {creator.dm_price_lamports ? (parseInt(creator.dm_price_lamports, 10) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"} SOL
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-white/5">
                    <Button 
                      className="w-full bg-white text-black hover:bg-white/90 font-medium"
                      onClick={() => handleConnectClick(creator)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Pay {creator?.dm_price_lamports ? (parseInt(creator.dm_price_lamports, 10) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"} SOL to connect
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

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Connect with {selectedCreator?.display_name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You are about to pay {selectedCreator?.dm_price_lamports ? (parseInt(selectedCreator.dm_price_lamports, 10) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"} SOL to send a direct message to this creator. 
              This payment will be processed securely on the Solana network.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-solana-purple/20 flex items-center justify-center text-solana-purple">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold text-solana-purple">{selectedCreator?.dm_price_lamports ? (parseInt(selectedCreator.dm_price_lamports, 10) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"} SOL</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentModalOpen(false)}
              disabled={isProcessingPayment}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="bg-solana-purple hover:bg-solana-purple/90 text-white"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${selectedCreator?.dm_price_lamports ? (parseInt(selectedCreator.dm_price_lamports, 10) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"} SOL`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
