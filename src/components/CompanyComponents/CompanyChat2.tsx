import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { axiosMain } from "@/Utils/axiosUtil";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useSocket } from "../../Context/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import UserStatic from "../../../public/User-Static-Logo.svg";

interface IMessage {
  _id: string;
  sender: string;
  content: string;
  timestamp: Date;
  user_id: string;
  company_id: string;
}

interface IChat {
  _id: string;
  user_id: string;
  company_id: string;
  messages: IMessage[];
  lastMessage?: string;
  lastMessageTime?: Date;
  userName: string;
  userAvatar: string;
}

interface UserSearchResult {
  _id: string;
  user_id: string;
  firstName: string;
  profileImage: string;
}

export function CompanyChatInterface() {
  const [chats, setChats] = useState<IChat[]>([]);
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [displayChats, setDisplayChats] = useState<IChat[]>([]);
  const [allProfileImages, setAllProfileImages] = useState<
    {
      user_id: string;
      profileImage: string;
    }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const company = useSelector((state: RootState) => state.company.companyInfo);
  const socket = useSocket();

  useEffect(() => {
    if (company) {
      fetchChatHistory();
    }
  }, [company]);

  useEffect(() => {
    if (socket) {
      socket.off("receiveMessage");

      socket.on("receiveMessage", (message: IMessage) => {
        setChats((prevChats) => {
          const chatIndex = prevChats.findIndex(
            (chat) => chat.user_id === message.user_id
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

        if (currentChat && currentChat.user_id === message.user_id) {
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
    getAllProfileImages();
    setDisplayChats(chats);
  }, [chats]);

  useEffect(() => {
    if (currentChat?.messages.length) {
      scrollToBottom();
    }
  }, [currentChat?.messages]);

  const getAllProfileImages = async () => {
    try {
      const response = await axiosMain.get(
        "/company/getAllUserProfileImages"
      );
      console.log(response.data);
      setAllProfileImages(response.data);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  const fetchChatHistory = async () => {
    if (!company) return;

    try {
      const response = await axiosMain.get<IChat[]>(`/chat/company-history`, {
        params: { company_id: company.company_id },
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
    if (newMessage.trim() !== "" && currentChat && company && socket) {
      const messageDetails = {
        sender: company.company_id,
        content: newMessage,
        timestamp: new Date(),
        user_id: currentChat.user_id,
        company_id: company.company_id,
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
      const response = await axiosMain.get<UserSearchResult[]>(
        `/company/search/users?query=${searchQuery}`
      );

      // Convert search results to chat format
      const searchResults = response.data.map((user) => {
        // Check if chat already exists with this user
        const existingChat = chats.find(
          (chat) => chat.user_id === user.user_id
        );
        if (existingChat) {
          return existingChat;
        }

        // Create new chat format for new users
        return {
          _id: `new_${user.user_id}`,
          user_id: user.user_id,
          company_id: company!.company_id,
          messages: [],
          userName: user.firstName,
          userAvatar: user.profileImage,
        };
      });
      console.log(searchResults);

      setDisplayChats(searchResults);
    } catch (error) {
      console.error("Error searching for users:", error);
      setDisplayChats([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectChat = (chat: IChat) => {
    setCurrentChat(chat);
    setSearchQuery("");

    // Join the chat room
    if (socket && company) {
      socket.emit("joinChat", {
        user_id: chat.user_id,
        company_id: company.company_id,
      });
    }
  };

  const handleSelectNewUser = (user: UserSearchResult) => {
    const newChat: IChat = {
      _id: Date.now().toString(),
      user_id: user.user_id,
      company_id: company!.company_id,
      messages: [],
      userName: user.firstName,
      userAvatar: user.profileImage,
    };

    // Join the chat room for new chat
    if (socket && company) {
      socket.emit("joinChat", {
        user_id: user.user_id,
        company_id: company.company_id,
      });
    }

    setChats((prevChats) => [...prevChats, newChat]);
    setCurrentChat(newChat);
    setSearchQuery("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderUserAvatar = (userId: string, userName: string) => {
    const userProfileImage = allProfileImages.find(
      (img) => img.user_id === userId
    )?.profileImage;

    return (
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage
          src={userProfileImage || UserStatic}
          alt={userName}
          className="w-8 h-8 rounded-full"
        />
        <AvatarFallback>{userName[0]}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="flex h-full bg-[#0a0c10]">
      <div className="w-80 bg-[#0d1117] border-r border-gray-800">
        <div className="p-4 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Chats</h2>
          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Search for users..."
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
                  onClick={() =>
                    chat._id.startsWith("new_")
                      ? handleSelectNewUser({
                          _id: chat._id,
                          user_id: chat.user_id,
                          firstName: chat.userName,
                          profileImage: chat.userAvatar,
                        })
                      : handleSelectChat(chat)
                  }
                  className={`p-2 hover:bg-[#1c2128] cursor-pointer ${
                    currentChat?._id === chat._id ? "bg-[#1c2128]" : ""
                  }`}
                >
                  <div className="flex items-center">
                    {renderUserAvatar(chat.user_id, chat.userName)}
                    <div className="flex-1">
                      <div className="font-semibold text-white">
                        {chat.userName}
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
                  ? "No users found"
                  : "No chats yet. Search for a user to start messaging."}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {currentChat ? (
          <>
            <div className="px-4 py-3 border-b border-gray-800 flex items-center">
              {renderUserAvatar(currentChat.user_id, currentChat.userName)}
              <h2 className="text-lg font-medium text-white">
                {currentChat.userName}
              </h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentChat.messages.map((message, index) => (
                  <div
                    key={message._id || `message-${index}`}
                    className={`flex ${
                      message.sender === company?.company_id
                        ? "justify-end"
                        : "justify-start"
                    } items-start gap-2`}
                  >
                    {message.sender === company?.company_id ? (
                      <>
                        <div className="max-w-[80%] bg-[#0066FF] text-white rounded-t-2xl rounded-bl-2xl px-4 py-2">
                          <p className="text-[15px]">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <Avatar className="h-8 w-12">
                          {company.profileImage ? (
                            <AvatarImage
                              src={company.profileImage}
                              alt="Company"
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <AvatarFallback>{company.name?.[0]}</AvatarFallback>
                          )}
                        </Avatar>
                      </>
                    ) : (
                      <>
                        {renderUserAvatar(
                          currentChat.user_id,
                          currentChat.userName
                        )}
                        <div className="max-w-[80%] bg-[#1c2128] text-white rounded-t-2xl rounded-br-2xl px-4 py-2">
                          <p className="text-[15px]">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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
                <Button
                  onClick={handleSendMessage}
                  className="ml-2 bg-[#0066FF] hover:bg-[#0052cc] text-white px-4"
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat or search for a user to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
