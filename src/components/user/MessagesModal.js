// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Container,
//   Segment,
//   Grid,
//   Feed,
//   Icon,
//   Image,
//   Progress,
//   Modal,
//   List,
//   IconGroup,
// } from "semantic-ui-react";
// import { deleteMessage, getMyMessages } from "../../api/message";
// import { useNavigate } from "react-router-dom";
// import LoadingScreen from "../shared/LoadingPage";
// import { createBuddy } from "../../api/user";

// const MessagesModal = ({ user, msgAlert }) => {
//   const [open, setOpen] = useState(false);
//   const [myMessages, setMymessages] = useState(null);
//   //piece of state to trigger a refresh if a request is accepted/denied => either way a message should be deleted and disappear from the modal
//   const [anUpdate, setAnUpdate] = useState(false);
//   //pull in navigate to a user can go to the profile of a requestor
//   const navigate = useNavigate();

//   //function to delete a message from a user's messages array. This happen whether the user accept's or rejects the request and will trigger a refresh of the modal so that the deleted message does not display
//   const handleDeleteMessage = (messageId) => {
//     deleteMessage(user, messageId)
//       .then(() => setAnUpdate((prev) => !prev))
//       .catch((error) =>
//         msgAlert({
//           heading: "There was a problem",
//           message: "Could not clear the request: " + error,
//           variant: "success",
//         })
//       );
//   };

//   //function to add sender of request to user's buddy array
//   const handleAddBuddy = (newBuddyId, messageId) => {
//     //we'll need to add more functionality so that a user cannot request to 'friend' someone who is already a buddy, but this check at least will prevent a buddy actually being adde twice (hopefully)
//     if (user.buddies.filter((buddy) => buddy._id == newBuddyId).length > 0) {
//       msgAlert({
//         heading: "No need",
//         message: "This badger buddy has already been added",
//         variant: "success",
//       });
//     }
//     if (user.buddies.filter((buddy) => buddy._id == newBuddyId).length === 0) {
//       createBuddy(user, newBuddyId)
//         .then(
//           msgAlert({
//             heading: "Success",
//             message: "You have a new friend",
//             variant: "success",
//           })
//         )
//         .catch((error) => {
//           msgAlert({
//             heading: "Sorry",
//             message: "Failure to add buddy: " + error,
//             variant: "danger",
//           });
//         });
//     }
//     //delete the message
//     handleDeleteMessage(messageId);
//   };

//   useEffect(() => {
//     if (open) {
//       getMyMessages(user)
//         .then((res) => {
//           setMymessages(res.data.messages);
//         })
//         .catch((error) => {
//           msgAlert({
//             heading: "Something went wrong",
//             message: "Could not get your messages " + error,
//             variant: "danger",
//           });
//         });
//     }
//   }, [open, anUpdate]);

//   let messagesJSX = null;
//   if (myMessages && myMessages.length > 0) {
//     messagesJSX = myMessages.map((message) => {
//       const sender = message.owner.username
//         ? message.owner.username
//         : message.owner.email;
//       return (
//         <List.Item key={message._id}>
//           {message.owner.avatar && <Image avatar src={message.owner.avatar} />}
//           <List.Content>
//             <List.Header
//               as="a"
//               onClick={() => navigate(`/user-public-page/${message.owner._id}`)}
//             >
//               {sender}
//             </List.Header>
//             <List.Description padded>
//               <p>
//                 {message.content}
//                 <Icon
//                   link
//                   onClick={() => handleAddBuddy(message.owner._id, message._id)}
//                   name="user"
//                   color="green"
//                 />
//                 <Icon
//                   link
//                   onClick={() => handleDeleteMessage(message._id)}
//                   name="dont"
//                   color="red"
//                 />
//               </p>
//             </List.Description>
//           </List.Content>
//         </List.Item>
//       );
//     });
//   } else if (myMessages && myMessages.length === 0) {
//     messagesJSX = <List.Item>No requests to display</List.Item>;
//   } else {
//     messagesJSX = <LoadingScreen />;
//   }

//   return (
//     <Modal
//       onClose={() => setOpen(false)}
//       onOpen={() => setOpen(true)}
//       open={open}
//       trigger={<Button>Show Messages</Button>}
//       size="small"
//     >
//       <Modal.Header>Buddy Requests</Modal.Header>
//       <Modal.Content scrolling></Modal.Content>
//       <Container fluid text>
//         <List>{messagesJSX}</List>
//       </Container>
//       <Modal.Actions>
//         <Button color="black" onClick={() => setOpen(false)}>
//           Close
//         </Button>
//       </Modal.Actions>
//     </Modal>
//   );
// };

// export default MessagesModal;

import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  List,
  Image,
  Icon,
  Modal,
} from "semantic-ui-react";
import { deleteMessage, getMyMessages } from "../../api/message";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../shared/LoadingPage";
import { createBuddy } from "../../api/user";
import RequestModal from "./RequestModal"; // Import RequestModal

const MessagesModal = ({ user, msgAlert }) => {
  const [open, setOpen] = useState(false);
  const [myMessages, setMymessages] = useState(null);
  const [anUpdate, setAnUpdate] = useState(false); // Triggers refresh
  const [selectedRecipient, setSelectedRecipient] = useState(null); // For RequestModal
  const [isRequestModalOpen, setRequestModalOpen] = useState(false); // Control RequestModal
  const navigate = useNavigate();

  // Fetch messages when modal is open
  useEffect(() => {
    if (open) {
      getMyMessages(user)
        .then((res) => {
          setMymessages(res.data.messages);
        })
        .catch((error) => {
          msgAlert({
            heading: "Something went wrong",
            message: "Could not get your messages: " + error,
            variant: "danger",
          });
        });
    }
  }, [open, anUpdate]);

  // Delete message
  const handleDeleteMessage = (messageId) => {
    deleteMessage(user, messageId)
      .then(() => setAnUpdate((prev) => !prev))
      .catch((error) =>
        msgAlert({
          heading: "There was a problem",
          message: "Could not clear the request: " + error,
          variant: "danger",
        })
      );
  };

  // Add buddy
  const handleAddBuddy = (newBuddyId, messageId) => {
    if (user.buddies.some((buddy) => buddy._id === newBuddyId)) {
      msgAlert({
        heading: "No need",
        message: "This badger buddy has already been added",
        variant: "success",
      });
    } else {
      createBuddy(user, newBuddyId)
        .then(() =>
          msgAlert({
            heading: "Success",
            message: "You have a new friend",
            variant: "success",
          })
        )
        .catch((error) =>
          msgAlert({
            heading: "Sorry",
            message: "Failure to add buddy: " + error,
            variant: "danger",
          })
        );
    }
    handleDeleteMessage(messageId); // Delete the message
  };

  // Render messages
  let messagesJSX = null;
  if (myMessages && myMessages.length > 0) {
    messagesJSX = myMessages.map((message) => {
      const sender = message.owner.username
        ? message.owner.username
        : message.owner.email;

      return (
        <List.Item key={message._id}>
          {message.owner.avatar && <Image avatar src={message.owner.avatar} />}
          <List.Content>
            <List.Header
              as="a"
              onClick={() => navigate(`/user-public-page/${message.owner._id}`)}
            >
              {sender}
            </List.Header>
            <List.Description>
              <p>{message.content}</p>
              {/* Reply Button */}
              <Button
                size="small"
                color="blue"
                onClick={() => {
                  setSelectedRecipient(message.owner);
                  setRequestModalOpen(true);
                }}
              >
                Reply
              </Button>
              {/* Add Buddy Button */}
              <Icon
                link
                onClick={() => handleAddBuddy(message.owner._id, message._id)}
                name="user"
                color="green"
              />
              {/* Delete Button */}
              <Icon
                link
                onClick={() => handleDeleteMessage(message._id)}
                name="dont"
                color="red"
              />
            </List.Description>
          </List.Content>
        </List.Item>
      );
    });
  } else if (myMessages && myMessages.length === 0) {
    messagesJSX = <List.Item>No requests to display</List.Item>;
  } else {
    messagesJSX = <LoadingScreen />;
  }

  return (
    <>
      {/* Main Messages Modal */}
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Show Messages</Button>}
        size="small"
      >
        <Modal.Header>Buddy Requests</Modal.Header>
        <Modal.Content scrolling>
          <Container fluid text>
            <List>{messagesJSX}</List>
          </Container>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>

      {/* RequestModal for Reply */}
      {selectedRecipient && (
        <RequestModal
          sender={user}
          recipient={selectedRecipient}
          msgAlert={msgAlert}
          open={isRequestModalOpen}
          onClose={() => setRequestModalOpen(false)}
        />
      )}
    </>
  );
};

export default MessagesModal;

// import React, { useState, useEffect } from "react";
// import { Button, Container, List, Image, Icon, Modal, Segment } from "semantic-ui-react";
// import {
//   deleteMessage,
//   getMyMessages,
//   getMessagesBetweenUsers,
// } from "../../api/message";
// import { useNavigate } from "react-router-dom";
// import LoadingScreen from "../shared/LoadingPage";
// import { createBuddy } from "../../api/user";
// import RequestModal from "./RequestModal"; // Import RequestModal

// const MessagesModal = ({ user, msgAlert }) => {
//   const [open, setOpen] = useState(false);
//   const [myMessages, setMymessages] = useState(null);
//   const [ongoingConversations, setOngoingConversations] = useState({}); // Stores conversations
//   const [anUpdate, setAnUpdate] = useState(false); // Triggers refresh
//   const [selectedRecipient, setSelectedRecipient] = useState(null); // For RequestModal
//   const [isRequestModalOpen, setRequestModalOpen] = useState(false); // Control RequestModal
//   const navigate = useNavigate();

//   // Fetch messages when modal is open
//   useEffect(() => {
//     if (open) {
//       getMyMessages(user)
//         .then((res) => {
//           setMymessages(res.data.messages);

//           // Fetch ongoing conversations for each message
//           res.data.messages.forEach((message) => {
//             const senderId = message.owner._id;
//             getMessagesBetweenUsers(user._id, senderId)
//               .then((response) => {
//                 setOngoingConversations((prev) => ({
//                   ...prev,
//                   [senderId]: response.data.messages,
//                 }));
//               })
//               .catch((error) => {
//                 msgAlert({
//                   heading: "Error",
//                   message: `Failed to fetch conversation with ${
//                     message.owner.username || message.owner.email
//                   }: ${error}`,
//                   variant: "danger",
//                 });
//               });
//           });
//         })
//         .catch((error) => {
//           msgAlert({
//             heading: "Something went wrong",
//             message: "Could not get your messages: " + error,
//             variant: "danger",
//           });
//         });
//     }
//   }, [open, anUpdate]);

//   // Delete message
//   const handleDeleteMessage = (messageId) => {
//     deleteMessage(user, messageId)
//       .then(() => setAnUpdate((prev) => !prev))
//       .catch((error) =>
//         msgAlert({
//           heading: "There was a problem",
//           message: "Could not clear the request: " + error,
//           variant: "danger",
//         })
//       );
//   };

//   // Add buddy
//   const handleAddBuddy = (newBuddyId, messageId) => {
//     if (user.buddies.some((buddy) => buddy._id === newBuddyId)) {
//       msgAlert({
//         heading: "No need",
//         message: "This badger buddy has already been added",
//         variant: "success",
//       });
//     } else {
//       createBuddy(user, newBuddyId)
//         .then(() =>
//           msgAlert({
//             heading: "Success",
//             message: "You have a new friend",
//             variant: "success",
//           })
//         )
//         .catch((error) =>
//           msgAlert({
//             heading: "Sorry",
//             message: "Failure to add buddy: " + error,
//             variant: "danger",
//           })
//         );
//     }
//     handleDeleteMessage(messageId); // Delete the message
//   };

//   // Render messages
//   let messagesJSX = null;
//   if (myMessages && myMessages.length > 0) {
//     messagesJSX = myMessages.map((message) => {
//       const sender = message.owner.username
//         ? message.owner.username
//         : message.owner.email;
//       const conversation = ongoingConversations[message.owner._id];

//       return (
//         <List.Item key={message._id}>
//           {message.owner.avatar && <Image avatar src={message.owner.avatar} />}
//           <List.Content>
//             <List.Header
//               as="a"
//               onClick={() => navigate(`/user-public-page/${message.owner._id}`)}
//             >
//               {sender}
//             </List.Header>
//             <List.Description>
//               <p>{message.content}</p>
//               {/* Display ongoing conversation */}
//               {conversation && conversation.length > 0 && (
//                 <div>
//                   <strong>Ongoing Conversation:</strong>
//                   <List>
//                     {conversation.map((msg) => (
//                       <List.Item key={msg._id}>
//                         <span>
//                           {msg.owner === user._id ? "You" : sender}:{" "}
//                           {msg.content}
//                         </span>
//                       </List.Item>
//                     ))}
//                   </List>
//                 </div>
//               )}
//               {/* Reply Button */}
//               <Button
//                 size="small"
//                 color="blue"
//                 onClick={() => {
//                   setSelectedRecipient(message.owner);
//                   setRequestModalOpen(true);
//                 }}
//               >
//                 Reply
//               </Button>
//               {/* Add Buddy Button */}
//               <Icon
//                 link
//                 onClick={() => handleAddBuddy(message.owner._id, message._id)}
//                 name="user"
//                 color="green"
//               />
//               {/* Delete Button */}
//               <Icon
//                 link
//                 onClick={() => handleDeleteMessage(message._id)}
//                 name="dont"
//                 color="red"
//               />
//             </List.Description>
//           </List.Content>
//         </List.Item>
//       );
//     });
//   } else if (myMessages && myMessages.length === 0) {
//     messagesJSX = <List.Item>No requests to display</List.Item>;
//   } else {
//     messagesJSX = <LoadingScreen />;
//   }

//   return (
//     <>
//       {/* Main Messages Modal */}

//       <h1>BUDDY REQUESTS</h1>
//       <Container fluid text>
//         {/* <List>{messagesJSX}</List> */}
//       </Container>
// <Segment>
//       <Container fluid>
//         {/* RequestModal for Reply */}
//         {/* {selectedRecipient && (
//           <RequestModal
//             sender={user}
//             recipient={selectedRecipient}
//             msgAlert={msgAlert}
//             open={isRequestModalOpen}
//             onClose={() => setRequestModalOpen(false)}
//           />
//         )} */}
//       </Container></Segment>
//     </>
//   );
// };

// export default MessagesModal;
