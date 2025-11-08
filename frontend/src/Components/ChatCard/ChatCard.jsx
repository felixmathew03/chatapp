import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { AiOutlineSend, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import route from "../route";
import socket from "../socket";
import "./ChatCard.scss";

const ChatCard = ({ id, setChatCardId, setIsChatOpen }) => {
  const value = localStorage.getItem("Auth");
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState({});
  const [messages, setMessages] = useState([]);
  const [longPressMsg, setLongPressMsg] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // 🟢 Fetch chat data and setup socket listeners
  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (!uid) return;

    socket.connect();

    // Join user-specific room
    socket.emit("join", uid);

    // Listen for new messages
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === receiver._id && msg.receiverId === uid) ||
        (msg.senderId === uid && msg.receiverId === receiver._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [uid, receiver]);

  // 🟢 Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🟢 Fetch messages + receiver data
  const getDetails = async () => {
    try {
      const { status, data } = await axios.get(`${route()}message/chat/${id}`, {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (status === 200) {
        setMessages(data.chats);
        setReceiver(data.receiver);
        setUid(data.uid);
      }
    } catch (err) {
      navigate("/login");
    }
  };

  // 🟢 Send a message
  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const { status, data } = await axios.post(
        `${route()}message/addmessage/${id}`,
        { message },
        { headers: { Authorization: `Bearer ${value}` } }
      );

      if (status === 201 && data.msg === "success") {
        const sentMsg = {
          message,
          senderId: uid,
          receiverId: receiver._id,
          createdAt: new Date().toISOString(),
        };

        socket.emit("sendMessage", sentMsg);
        setMessages((prev) => [...prev, sentMsg]);
        setMessage("");
      }
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  // 🟢 Delete a message
  const handleDelete = async () => {
    try {
      const { status, data } = await axios.delete(
        `${route()}message/deletemessage/${longPressMsg._id}`,
        { headers: { Authorization: `Bearer ${value}` } }
      );

      if (status === 201 && data.msg === "success") {
        setMessages((prev) => prev.filter((m) => m._id !== longPressMsg._id));
      }
    } catch {
      alert("Cannot delete others' message");
    } finally {
      setShowPopover(false);
    }
  };

  return (
    <div className="chat-card">
      {/* Header */}
      <div className="chat-header">
        <div className="h2">
          <button
            onClick={() => {
              setChatCardId(null);
              setIsChatOpen(false);
            }}
          >
            <FiArrowLeft className="back-icon" />
          </button>
          <Link to={`/userprofile/${receiver._id}`}>
            <img src={receiver.profile} alt={receiver.username} />
          </Link>
          <p>{receiver.username}</p>
        </div>
      </div>

      {/* Chat body */}
      <div className="chat-body">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.senderId === uid ? "message outgoing" : "message incoming"
              }
              onMouseDown={() =>
                setTimeout(() => {
                  setLongPressMsg(msg);
                  setShowPopover(true);
                }, 500)
              }
              onMouseUp={() => clearTimeout()}
            >
              <p>{msg.message}</p>
              <p className="foot">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>

              {showPopover && longPressMsg === msg && (
                <div className="popover">
                  <button onClick={handleDelete}>
                    <AiOutlineDelete />
                  </button>
                  <button onClick={() => setShowPopover(false)}>
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Footer */}
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={handleSend} disabled={!message.trim()}>
          <AiOutlineSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatCard;
