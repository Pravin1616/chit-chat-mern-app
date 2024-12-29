import React from "react";
import { Tooltip, OverlayTrigger, Image } from "react-bootstrap";
import ScrollableFeed from "react-scrollable-feed";
import { PersonCircle } from "react-bootstrap-icons";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="d-flex align-items-start mb-2" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{m.sender.name}</Tooltip>}
              >
                {m.sender.pic ? (
                  <Image
                    src={m.sender.pic}
                    roundedCircle
                    className="me-2"
                    style={{ width: "32px", height: "32px", cursor: "pointer" }}
                    alt={m.sender.name}
                  />
                ) : (
                  <PersonCircle
                    className="me-2"
                    style={{ fontSize: "32px", cursor: "pointer" }}
                  />
                )}
              </OverlayTrigger>
            )}
            <span
              className="px-3 py-2"
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
