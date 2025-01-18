import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, List, Segment } from "semantic-ui-react";
import { createMessage, getAllMessages } from "../../api/message";

const RequestModal = ({ sender, recipient, msgAlert }) => {
  const [open, setOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null); // Ref to scroll the container

  // Fetch all messages and filter for relevant ones
  const fetchMessages = () => {
    getAllMessages()
      .then((res) => {
        const relevantMessages = res.data.messages.filter((message) => {
          return (
            (message.owner?._id === sender._id &&
              message.recipient === recipient._id) ||
            (message.owner?._id === recipient._id &&
              message.recipient === sender._id)
          );
        });

        setMessages(relevantMessages);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        msgAlert({
          heading: "Error",
          message: "Failed to load messages: " + err.message,
          variant: "danger",
        });
      });
  };

  // Send a new message
  const sendMessage = (e) => {
    e.preventDefault();

    const newMessage = {
      recipient: recipient._id,
      content: messageContent,
    };

    createMessage(sender, newMessage)
      .then((res) => {
        const savedMessage = res.data.message;

        const completeMessage = {
          ...savedMessage,
          owner: { _id: sender._id, email: sender.email },
        };

        setMessages((prevMessages) => [...prevMessages, completeMessage]);
        setMessageContent(""); // Clear the input field

        // Scroll to the bottom after the new message is added
        if (messageListRef.current) {
          messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }

        msgAlert({
          heading: "Sent",
          message: "Message sent successfully",
          variant: "success",
        });
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        msgAlert({
          heading: "Error",
          message: "Failed to send message: " + err.message,
          variant: "danger",
        });
      });
  };

  // Handle modal open and close
  const handleOpen = () => {
    setOpen(true);
    fetchMessages();
  };

  const handleClose = () => {
    setOpen(false);
    setMessages([]);
  };

  return (
    <Modal
      closeIcon
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      trigger={
        <Button color="blue" style={{ margin: "10px" }}>
          Message
        </Button>
      }
    >
      <Modal.Header>
        Chat with {recipient.username || recipient.email}
      </Modal.Header>
      <Modal.Content>
        <Segment
          ref={messageListRef}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column-reverse", // Reverse the flex direction for newest messages at the bottom
          }}
        >
          <List divided relaxed
>
            {messages.map((msg) => (
              <List.Item key={msg._id} style={{ marginBottom: "10px" }}>
                <List.Content>
                  <Segment
                    style={{
                      backgroundColor: "#FFD700", // Dark yellow
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    <List.Header
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: "1em",
                      }}
                    >
                      {msg.owner?._id === sender._id
                        ? "You"
                        : msg.owner?.username ||
                          msg.owner?.email ||
                          "Unknown Sender"}
                    </List.Header>
                  </Segment>
                  <List.Description>{msg.content}</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>

        <Form onSubmit={sendMessage} style={{ marginTop: "10px" }}>
          <Form.Group style={{ display: "flex", alignItems: "center" }}>
            <Form.Input
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              style={{ flex: "1", marginRight: "10px" }}
            />
            <Button type="submit" color="blue">
              Send
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default RequestModal;