import React, { useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center p-3">
        <h5 className="m-0">My Chats</h5>
        <GroupChatModal>
          <Button variant="outline-primary" size="sm">
            New Group Chat <Plus />
          </Button>
        </GroupChatModal>
      </Card.Header>
      <Card.Body className="overflow-auto p-0">
        {chats ? (
          <ListGroup className="p-2">
            {chats.map((chat) => (
              <ListGroup.Item
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className="my-1"
                style={{
                  cursor: "pointer",
                  height: "65px",
                  backgroundColor:
                    selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                  color: selectedChat === chat ? "white" : "black",
                }}
              >
                <div>
                  <strong>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </strong>
                </div>
                {chat.latestMessage && (
                  <small>
                    <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </small>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <ChatLoading />
        )}
      </Card.Body>
    </Card>
  );
};

export default MyChats;
