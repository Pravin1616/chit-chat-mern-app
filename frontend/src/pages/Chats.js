import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import Header from "../components/miscellaneous/Header";
import { ChatState } from "../context/ChatProvider";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <>
      {user && <Header />}
      <Container fluid style={{ height: "91.5vh" }}>
        <Row className="h-100 p-3">
          {user && (
            <Col md={4} className="p-0 h-100">
              <MyChats fetchAgain={fetchAgain} />
            </Col>
          )}
          {user && (
            <Col md={8} className="h-100">
              <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Chat;
