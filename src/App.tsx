/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreatorDashboard from "./pages/dashboard/CreatorDashboard";
import AudienceDashboard from "./pages/dashboard/AudienceDashboard";
import AudienceChat from "./pages/chat/AudienceChat";
import CreatorChat from "./pages/chat/CreatorChat";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Solana Wallet Adapter Imports
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  // Set up the network to devnet, testnet, or mainnet-beta.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      // If you wish to support a wallet that supports the standard, you don't need to add it here.
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard/creator" 
                element={
                  <ProtectedRoute allowedRole="creator">
                    <CreatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat/creator" 
                element={
                  <ProtectedRoute allowedRole="creator">
                    <CreatorChat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/audience" 
                element={
                  <ProtectedRoute allowedRole="audience">
                    <AudienceDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat/audience" 
                element={
                  <ProtectedRoute allowedRole="audience">
                    <AudienceChat />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
          <Toaster />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
