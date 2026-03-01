import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2, MessageCircle, Check, CheckCheck } from "lucide-react";
import Cookies from "js-cookie";
import { api } from "@/services/api";

interface ChatUser {
  id: string;
  username: string;
  display_name: string;
  profile_image_url: string | null;
  unread_count?: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read?: boolean;
  is_priority?: boolean;
  created_at: string;
}

export default function CreatorChat() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
    fetchChatUsers();
  }, [navigate]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      // Mark conversation as read and optimistically reset unread count
      api.patch(`/messages/conversations/${selectedUser.id}/read`)
        .then(() => {
          setChatUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, unread_count: 0 } : u));
        })
        .catch(err => console.error("Failed to mark messages as read:", err));
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get("/dashboard/connections"); 
      if (response.data.success) {
        setChatUsers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      setLoadingMessages(true);
      const response = await api.get(`/messages/conversations/${userId}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const tempMessage = {
      id: Date.now().toString(),
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");

    try {
      await api.post(`/messages/send`, {
        receiver_id: selectedUser.id,
        content: tempMessage.content
      });
      // Refresh messages to get the real ones (and any new ones)
      fetchMessages(selectedUser.id);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar: Chat List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-background/50 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="h-16 border-b border-white/10 flex items-center px-4 shrink-0 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/creator")} className="shrink-0 hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">Messages</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loadingUsers ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : chatUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No active chats yet.</p>
              <p className="text-sm mt-1">Waiting for users to connect.</p>
            </div>
          ) : (
            chatUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                  selectedUser?.id === u.id ? 'bg-solana-purple/20' : 'hover:bg-white/5'
                }`}
              >
                <Avatar className="w-12 h-12 border border-white/10">
                  <AvatarImage src={u.profile_image_url || undefined} />
                  <AvatarFallback className="bg-solana-purple/20 text-solana-purple font-semibold">
                    {u.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{u.display_name}</h3>
                    {(u.unread_count ?? 0) > 0 && (
                      <span className="bg-solana-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {u.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-white/10 flex items-center px-4 shrink-0 bg-background/80 backdrop-blur-sm gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)} className="md:hidden shrink-0 hover:bg-white/5 mr-1">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10 border border-white/10">
                <AvatarImage src={selectedUser.profile_image_url || undefined} />
                <AvatarFallback className="bg-solana-purple/20 text-solana-purple font-semibold">
                  {selectedUser.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold leading-tight">{selectedUser.display_name}</h2>
                <p className="text-xs text-muted-foreground">@{selectedUser.username}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-white/[0.02]">
              {loadingMessages ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-solana-purple" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
                  <p>Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender_id === currentUser.id;
                  const timeStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(msg.created_at));
                  return (
                    <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm flex flex-col ${
                          isMe 
                            ? 'bg-solana-purple text-white rounded-br-sm' 
                            : 'bg-white/10 text-foreground rounded-bl-sm border border-white/5'
                        }`}
                      >
                        {msg.is_priority && !isMe && (
                          <span className="text-[10px] font-bold text-solana-green mb-1 uppercase tracking-wider">Priority</span>
                        )}
                        <div className="break-words">
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 self-end text-[10px] ${isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                          <span>{timeStr}</span>
                          {isMe && (
                            msg.is_read ? (
                              <CheckCheck className="w-3 h-3 text-blue-400" />
                            ) : (
                              <Check className="w-3 h-3 text-white/70" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-background/80 backdrop-blur-sm">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border-white/10 focus-visible:ring-solana-purple rounded-full px-4"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  size="icon"
                  className="rounded-full bg-solana-purple hover:bg-solana-purple/90 shrink-0 w-10 h-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-white/[0.01]">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-foreground mb-1">Your Messages</h3>
            <p>Select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
