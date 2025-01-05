import React, { Fragment } from "react";
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
          <Fragment key={i}>
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
                      style={{
                        width: "43px",
                        height: "43px",
                        cursor: "pointer",
                      }}
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
              <div
                className="d-flex flex-column"
                style={{
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                <span
                  className="px-3 py-2"
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    borderRadius: "20px",
                  }}
                >
                  {m.content}
                </span>
                {m?.media &&
                  (m.media.startsWith("data:image") ||
                  m.media.endsWith(".jpg") ||
                  m.media.endsWith(".png") ? (
                    <img
                      src={m.media}
                      alt="Preview"
                      className="my-2"
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                    />
                  ) : m.media.startsWith("data:video") ||
                    m.media.endsWith(".mp4") ||
                    m.media.endsWith(".mov") ? (
                    <video
                      src={m.media}
                      alt="Preview"
                      className="my-2"
                      style={{
                        width: "100%",
                        height: "100px",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                      muted
                      controls
                    />
                  ) : null)}
              </div>
            </div>
          </Fragment>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
