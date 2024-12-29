import React, { useEffect, useState } from "react";
import { FormControl, InputGroup, Button, Spinner } from "react-bootstrap";
import { Arrow90degRight } from "react-bootstrap-icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import axios from "axios";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../context/ChatProvider";
import { useToast } from "../context/ToastProvider";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { addToast } = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      addToast("Failed to Load the Messages", "warning");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        addToast("Failed to Send the Messages", "warning");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div
            style={{
              fontSize: "30px",
              paddingBottom: "10px",
              paddingLeft: "20px",
              width: "100%",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="link"
              style={{ display: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <Arrow90degRight />
            </Button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "20px",
              backgroundColor: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <Spinner
                animation="border"
                role="status"
                style={{ width: "50px", height: "50px", margin: "auto" }}
              />
            ) : (
              <div className="messages overflow-auto">
                <ScrollableChat messages={messages} />
                {istyping && (
                  <div className="my-2">
                    <Lottie options={defaultOptions} width={70} />
                  </div>
                )}
              </div>
            )}

            <InputGroup className="mt-3" onKeyDown={sendMessage}>
              <FormControl
                type="text"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                style={{ backgroundColor: "#E0E0E0" }}
                required
              />
            </InputGroup>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              paddingBottom: "20px",
              fontFamily: "Work sans",
            }}
          >
            Click on a user to start chatting
          </div>
        </div>
      )}
    </>
  );
};

export default SingleChat;