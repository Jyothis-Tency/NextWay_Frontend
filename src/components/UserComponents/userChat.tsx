import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { axiosChat, axiosCompany } from "@/Utils/axiosUtil";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "../../Context/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import CompanyStatic from "/Comany-Static-Logo.svg";

interface IMessage {
  _id: string;
  sender: string;
  content: string;
  timestamp: Date;
  user_id: string;
  company_id: string;
  profileImage?: string;
}

interface IChat {
  _id: string;
  user_id: string;
  company_id: string;
  messages: IMessage[];
  lastMessage?: string;
  lastMessageTime?: Date;
  companyName: string;
  companyAvatar: string;
}

interface CompanySearchResult {
  _id: string;
  company_id: string;
  name: string;
  industry: string;
  profileImage: string;
}

export function UserChatInterface() {
  const [chats, setChats] = useState<IChat[]>([]);
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false);
  const [displayChats, setDisplayChats] = useState<IChat[]>([]);
  const [allProfileImages, setAllProfileImages] = useState<
    {
      company_id: string;
      profileImage: string;
    }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user.userInfo);
  const socket = useSocket();

  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      // Remove any existing listeners first
      socket.off("receiveMessage");

      socket.on("receiveMessage", (message: IMessage) => {
        console.log(`socket.on("receiveMessage" on user chat`);
        setChats((prevChats) => {
          const chatIndex = prevChats.findIndex(
            (chat) => chat.company_id === message.company_id
          );
          if (chatIndex !== -1) {
            const updatedChats = [...prevChats];
            // Check if message already exists
            if (
              !updatedChats[chatIndex].messages.some(
                (m) => m._id === message._id
              )
            ) {
              updatedChats[chatIndex].messages.push(message);
              updatedChats[chatIndex].lastMessage = message.content;
              updatedChats[chatIndex].lastMessageTime = message.timestamp;
              // Scroll to bottom after state update
              setTimeout(() => scrollToBottom(), 100);
            }
            return updatedChats;
          }
          return prevChats;
        });

        if (currentChat && currentChat.company_id === message.company_id) {
          setCurrentChat((prevChat) => {
            if (!prevChat?.messages.some((m) => m._id === message._id)) {
              // Scroll to bottom after state update
              setTimeout(() => scrollToBottom(), 100);
              return {
                ...prevChat!,
                messages: [...prevChat!.messages, message],
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
              };
            }
            return prevChat;
          });
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [socket, currentChat]);

  useEffect(() => {
    setDisplayChats(chats);
    getAllProfileImages()
  }, [chats]);

  useEffect(() => {
    if (currentChat?.messages.length) {
      scrollToBottom();
    }
  }, [currentChat?.messages]);

  const getAllProfileImages = async () => {
    try {
      const response = await axiosCompany.get("/getAllCompanyProfileImages");
      console.log(response.data);
      setAllProfileImages(response.data);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  const fetchChatHistory = async () => {
    if (!user) return;

    try {
      const response = await axiosChat.get<IChat[]>(`/user-history`, {
        params: { user_id: user.user_id },
      });
      console.log("Fetched chat history:", response.data);

      // Sort chats by last message time
      const sortedChats = response.data.sort((a, b) => {
        const timeA = new Date(a.lastMessageTime || 0).getTime();
        const timeB = new Date(b.lastMessageTime || 0).getTime();
        return timeB - timeA;
      });

      setChats(sortedChats);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && currentChat && user && socket) {
      const messageDetails = {
        sender: user.user_id,
        content: newMessage,
        timestamp: new Date(),
        user_id: user.user_id,
        company_id: currentChat.company_id,
      };

      socket.emit("sendMessage", messageDetails);
      // Scroll to bottom after sending message
      setTimeout(() => scrollToBottom(), 100);
      setNewMessage("");
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setDisplayChats(chats);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosCompany.get<CompanySearchResult[]>(
        `/search/companies?query=${searchQuery}`
      );
      console.log("response.data : ", response.data);

      // Convert search results to chat format
      const searchResults = response.data.map((company) => {
        // Check if chat already exists with this company
        const existingChat = chats.find(
          (chat) => chat.company_id === company.company_id
        );
        if (existingChat) {
          return existingChat;
        }

        // Create new chat format for new companies
        return {
          _id: `new_${company.company_id}`,
          user_id: user!.user_id,
          company_id: company.company_id,
          messages: [],
          companyName: company.name,
          companyAvatar: company.profileImage,
        };
      });

      setDisplayChats(searchResults);
    } catch (error) {
      console.error("Error searching for companies:", error);
      setDisplayChats([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectChat = (chat: IChat) => {
    setCurrentChat(chat);
    setSearchResults([]);
    setSearchQuery("");

    // Join the chat room
    if (socket && user) {
      socket.emit("joinChat", {
        user_id: user.user_id,
        company_id: chat.company_id,
      });
    }
  };

  const handleSelectNewCompany = (company: CompanySearchResult) => {
    const newChat: IChat = {
      _id: Date.now().toString(),
      user_id: user!.user_id,
      company_id: company.company_id,
      messages: [],
      companyName: company.name,
      companyAvatar: company.profileImage,
    };

    // Join the chat room for new chat
    if (socket && user) {
      socket.emit("joinChat", {
        user_id: user.user_id,
        company_id: company.company_id,
      });
    }

    setChats((prevChats) => [...prevChats, newChat]);
    setCurrentChat(newChat);
    setSearchResults([]);
    setSearchQuery("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderUserAvatar = (companyId: string, companyName: string) => {
    const userProfileImage = allProfileImages.find(
      (img) => img.company_id === companyId
    )?.profileImage;

    return (
      <Avatar className="h-8 w-12 mr-2 mb-3">
        <AvatarImage
          src={userProfileImage || CompanyStatic}
          alt={companyName}
          className="w-12 h-12 rounded-full"
        />
        <AvatarFallback>{companyName[0]}</AvatarFallback>
      </Avatar>
    );
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4">Chats</h2>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search for companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-grow"
        />
        <Button
          onClick={handleSearch}
          className="ml-2 bg-[#1c2128] hover:bg-[#2c3138]"
          disabled={isSearching}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {displayChats.length > 0 ? (
          displayChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                chat._id.startsWith("new_")
                  ? handleSelectNewCompany({
                      _id: chat._id,
                      company_id: chat.company_id,
                      name: chat.companyName,
                      industry: "",
                      profileImage: chat.companyAvatar,
                    })
                  : handleSelectChat(chat);
                setIsSidebarOpen(false);
              }}
              className={`p-2 hover:bg-[#1c2128] cursor-pointer ${
                currentChat?._id === chat._id ? "bg-[#1c2128]" : ""
              }`}
            >
              <div className="flex items-center">
                {renderUserAvatar(chat.company_id, chat.companyName)}
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {chat.companyName}
                  </div>
                  {chat.lastMessage && (
                    <div className="text-sm text-gray-400 truncate">
                      {chat.lastMessage}
                    </div>
                  )}
                </div>
                {chat.lastMessageTime && (
                  <div className="text-xs text-gray-500">
                    {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-4">
            {searchQuery
              ? "No companies found"
              : "No chats yet. Search for a company to start messaging."}
          </div>
        )}
      </ScrollArea>
    </div>
  );

return (
    <div className="flex h-full bg-[#0a0c10]">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden mt-20 fixed left-4 z-50">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-[#1c2128] hover:bg-[#2c3138]">
              <Menu className="h-5 w-5 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-4 bg-[#0d1117] border-r border-gray-800">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 bg-[#0d1117] border-r border-gray-800">
        <div className="p-4 h-full">
          <SidebarContent />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {currentChat ? (
          <>
            <div className="px-4 py-3 border-b border-gray-800 flex items-center">
              {renderUserAvatar(currentChat.company_id, currentChat.companyName)}
              <h2 className="text-lg font-medium text-white ml-3">{currentChat.companyName}</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentChat.messages.map((message, index) => (
                  <div
                    key={message._id || `message-${index}`}
                    className={`flex ${
                      message.sender === user?.user_id ? "justify-end" : "justify-start"
                    } items-start gap-2`}
                  >
                    {message.sender === user?.user_id ? (
                      <>
                        <div className="max-w-[80%] bg-[#0066FF] text-white rounded-t-2xl rounded-bl-2xl px-4 py-2">
                          <p className="text-[15px]">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Avatar className="h-10 w-10 rounded-full">
                          {user.profileImage ? (
                            <AvatarImage
                              src={user.profileImage}
                              alt="User"
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="rounded-full">{user.firstName?.[0]}</AvatarFallback>
                          )}
                        </Avatar>
                      </>
                    ) : (
                      <>
                        {renderUserAvatar(currentChat.company_id, currentChat.companyName)}
                        <div className="max-w-[80%] bg-[#1c2128] text-white rounded-t-2xl rounded-br-2xl px-4 py-2">
                          <p className="text-[15px]">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-[#1c2128] border-0 text-white placeholder-gray-400 focus-visible:ring-1 focus-visible:ring-gray-600"
                />
                <Button onClick={handleSendMessage} className="ml-2 bg-[#0066FF] hover:bg-[#0052cc] text-white px-4">
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat or search for a company to start messaging
          </div>
        )}
      </div>
    </div>
  )
}


