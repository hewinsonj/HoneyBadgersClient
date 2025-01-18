import React, { useEffect, useState } from "react";
import { Modal, List, Segment, Button, Image, Label } from "semantic-ui-react";
import { getMyMessages, deleteMessage } from "../../api/message"; // Import getMyMessages and deleteMessage
import { createBuddy, getMyBuddies, deleteBuddy } from "../../api/user"; // Import createBuddy, getBuddies, and removeBuddy API functions
import BadgesSegment from "../badges/BadgesSegment"; // Import badge logic for displaying badges

const BuddyModal = ({ user, msgAlert }) => {
  const [open, setOpen] = useState(false); // Modal open state
  const [buddyRequests, setBuddyRequests] = useState([]); // Store filtered buddy messages
  const [buddies, setBuddies] = useState([]); // Store current buddies
  const [hasBuddyRequests, setHasBuddyRequests] = useState(false); // Tracks if there are pending buddy requests

  // Fetch buddy requests and current buddies when the modal opens or to update the alert
  useEffect(() => {
    // Fetch buddy requests
    getMyMessages(user)
      .then((res) => {
        const filteredRequests = res.data.messages.filter(
          (message) => message.isBuddyMessage
        );
        setBuddyRequests(filteredRequests);

        // Update alert visibility
        setHasBuddyRequests(filteredRequests.length > 0);
      })
      .catch((error) => {
        msgAlert({
          heading: "Error",
          message: "Failed to fetch buddy requests: " + error.message,
          variant: "danger",
        });
      });

    // Fetch current buddies
    if (open) {
      getMyBuddies(user)
        .then((res) => {
          setBuddies(res.data.buddies);
        })
        .catch((error) => {
          msgAlert({
            heading: "Error",
            message: "Failed to fetch buddies: " + error.message,
            variant: "danger",
          });
        });
    }
  }, [open, user, msgAlert]);

  // Handle accepting a buddy request
  const handleAcceptRequest = (message) => {
    const newBuddyId = message.owner._id;

    createBuddy(user, newBuddyId)
      .then(() => {
        msgAlert({
          heading: "Success",
          message: `${message.owner.username || "User"} is now your buddy!`,
          variant: "success",
        });

        // Delete the buddy request message
        return deleteMessage(user, message._id);
      })
      .then(() => {
        setBuddyRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== message._id)
        );

        // Update alert visibility
        setHasBuddyRequests(
          buddyRequests.filter((req) => req._id !== message._id).length > 0
        );

        // Refresh the buddy list
        return getMyBuddies(user);
      })
      .then((res) => {
        setBuddies(res.data.buddies);
      })
      .catch((error) => {
        msgAlert({
          heading: "Error",
          message: "Failed to accept buddy request: " + error.message,
          variant: "danger",
        });
      });
  };

  // Handle denying a buddy request
  const handleDenyRequest = (messageId) => {
    deleteMessage(user, messageId)
      .then(() => {
        msgAlert({
          heading: "Request Denied",
          message: "Buddy request has been denied.",
          variant: "info",
        });

        // Remove the request from the UI
        setBuddyRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== messageId)
        );

        // Update alert visibility
        setHasBuddyRequests(
          buddyRequests.filter((req) => req._id !== messageId).length > 0
        );
      })
      .catch((error) => {
        msgAlert({
          heading: "Error",
          message: "Failed to deny buddy request: " + error.message,
          variant: "danger",
        });
      });
  };

  // Handle removing a buddy
  const handleRemoveBuddy = (buddyId) => {
    if (window.confirm("Are you sure you want to remove this buddy?")) {
      deleteBuddy(user, buddyId)
        .then(() => {
          msgAlert({
            heading: "Buddy Removed",
            message: "The buddy has been successfully removed.",
            variant: "info",
          });

          // Remove the buddy from the list
          setBuddies((prevBuddies) =>
            prevBuddies.filter((buddy) => buddy._id !== buddyId)
          );
        })
        .catch((error) => {
          msgAlert({
            heading: "Error",
            message: "Failed to remove buddy: " + error.message,
            variant: "danger",
          });
        });
    }
  };

  // Render buddy requests
  const buddyRequestsJSX = buddyRequests.length > 0 ? (
    <div style={{ display: "flex", overflowX: "scroll", gap: "20px", padding: "10px" }}>
      {buddyRequests.map((message) => (
        <div
          key={message._id}
          style={{
            textAlign: "center",
            minWidth: "150px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: "10px" }}>
            {message.owner.username || message.owner.email}
          </p>
          <Image
            src={message.owner.avatar || "/default-avatar.png"}
            size="small"
            circular
            style={{ margin: "0 auto" }}
          />
          <Button
            color="green"
            size="small"
            style={{ marginTop: "10px" }}
            onClick={() => handleAcceptRequest(message)}
          >
            Accept
          </Button>
          <Button
            color="red"
            size="small"
            style={{ marginTop: "10px" }}
            onClick={() => handleDenyRequest(message._id)}
          >
            Deny
          </Button>
        </div>
      ))}
    </div>
  ) : (
    <p>No buddy requests available.</p>
  );

  // Render current buddies
  const buddiesJSX = buddies.length > 0 ? (
    <div style={{ display: "flex", overflowX: "scroll", gap: "20px", padding: "10px" }}>
      {buddies.map((buddy) => (
        <div
          key={buddy._id}
          style={{
            textAlign: "center",
            minWidth: "150px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: "10px" }}>
            {buddy.username || buddy.email}
          </p>
          <Image
            src={buddy.avatar || "/default-avatar.png"}
            size="small"
            circular
            style={{ margin: "0 auto" }}
          />
          <Button
            color="red"
            size="small"
            style={{ marginTop: "10px" }}
            onClick={() => handleRemoveBuddy(buddy._id)}
          >
            Remove Buddy
          </Button>
        </div>
      ))}
    </div>
  ) : (
    <p>You currently have no buddies.</p>
  );

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button>
          View Buddy Page
          {hasBuddyRequests && (
            
            <Label circular color="red" >
              NEW BUDDY REQUEST!
            </Label>
          )}
        </Button>
      }
    >
      <Modal.Header>Buddy Requests</Modal.Header>
      <Modal.Content>
        <Segment>
          <h3>Pending Requests</h3>
          <List divided relaxed>
            {buddyRequestsJSX}
          </List>
        </Segment>
        <Segment>
          <h3>Your Buddies</h3>
          <List divided relaxed>
            {buddiesJSX}
          </List>
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default BuddyModal;