import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Button,
  Dropdown,
  Tooltip,
  OverlayTrigger,
  Offcanvas,
  Form,
  Spinner,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";

function Header() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { setSelectedChat, user, chats, setChats } = ChatState();

  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please Enter something in search");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult([...data]);
    } catch (error) {
      alert("Error occurred: Failed to load the search results.");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      alert("Error fetching the chat: " + error.message);
    }
  };

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-between align-items-center bg-white border"
        style={{ padding: "5px 10px" }}
      >
        {/* Search Button with Tooltip */}
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-bottom">Search Users to chat</Tooltip>}
        >
          <div onClick={handleShow} className="d-flex align-items-center">
            <Search size={16} className="ms-2" />
            <span className="d-none d-md-inline px-2">Search User</span>
          </div>
        </OverlayTrigger>

        {/* App Title */}
        <h2 className="font-weight-bold m-0">ChitChat</h2>

        <div className="d-flex align-items-center">
          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="light"
              className="d-flex align-items-center"
            >
              <img
                src={user.pic}
                alt="User Avatar"
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <ProfileModal user={user}>
                <Dropdown.Item>My Profile</Dropdown.Item>
              </ProfileModal>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search Users</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Search Input and Button */}
          <div className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="me-2"
            />
            <Button variant="primary" onClick={handleSearch}>
              Go
            </Button>
          </div>
          {/* Search Results */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <ChatLoading />
            </div>
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => {
                  handleClose();
                  accessChat(user._id);
                }}
              />
            ))
          )}

          {/* Loading Chat Spinner */}
          {loadingChat && (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
