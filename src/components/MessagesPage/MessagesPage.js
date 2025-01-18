// import React, { useState, useEffect } from "react";
// import { Segment, Image, Button, Header } from "semantic-ui-react";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import { getMyMessages } from "../../api/message";
// import { getMyBuddies } from "../../api/user";
// import RequestModal from "../user/RequestModal";

// const MessagesPage = ({ user, msgAlert }) => {
//   const [messages, setMessages] = useState([]);
//   const [buddies, setBuddies] = useState([]);

//   // Fetch messages on component mount
//   useEffect(() => {
//     getMyMessages(user)
//       .then((res) => {
//         setMessages(res.data.messages);
//       })
//       .catch((error) => {
//         msgAlert({
//           heading: "Error",
//           message: "Failed to load messages: " + error.message,
//           variant: "danger",
//         });
//       });
//   }, [user, msgAlert]);

//   // Fetch buddies on component mount
//   useEffect(() => {
//     getMyBuddies(user)
//       .then((res) => {
//         setBuddies(res.data.buddies);
//       })
//       .catch((error) => {
//         msgAlert({
//           heading: "Error",
//           message: "Failed to load buddies: " + error.message,
//           variant: "danger",
//         });
//       });
//   }, [user, msgAlert]);

//   // Get the latest message for each buddy
//   const getLastMessages = () => {
//     const uniqueMessages = {};
//     messages.forEach((message) => {
//       const otherUser =
//         message.owner._id === user._id ? message.recipient : message.owner;

//       if (
//         !uniqueMessages[otherUser._id] ||
//         new Date(message.createdAt) >
//           new Date(uniqueMessages[otherUser._id].createdAt)
//       ) {
//         uniqueMessages[otherUser._id] = { ...message, otherUser };
//       }
//     });
//     return uniqueMessages;
//   };

//   // Get most recent message or default text for each buddy
//   const lastMessagesByBuddy = buddies.map((buddy) => {
//     const lastMessage = getLastMessages()[buddy._id] || {
//       content: "No messages yet.",
//       owner: user,
//       otherUser: buddy,
//     };

//     return { buddy, lastMessage };
//   });

//   return (
//     <>
//       <Segment>
//         <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
//           Your Messages
//         </Header>

//         <div>
//           {lastMessagesByBuddy.map(({ buddy, lastMessage }) => (
//             <div
//               key={buddy._id}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 border: "1px solid #ddd",
//                 borderRadius: "10px",
//                 padding: "10px",
//                 marginBottom: "10px",
//                 boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//                 backgroundColor: "#f9f9f9",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <Link to={`/user-public-page/${buddy._id}`}>
//                   <Image
//                     src={buddy.avatar || "/default-avatar.png"}
//                     size="tiny"
//                     circular
//                     style={{ marginRight: "10px" }}
//                   />
//                 </Link>
//                 <div>
//                   <Link
//                     to={`/user-public-page/${buddy._id}`}
//                     style={{
//                       fontWeight: "bold",
//                       fontSize: "1.2em",
//                       margin: 0,
//                       textDecoration: "none",
//                       color: "black",
//                     }}
//                   >
//                     {buddy.username || buddy.email}
//                   </Link>
//                   <p style={{ fontSize: "0.9em", color: "#555", margin: 0 }}>
//                     {lastMessage.content.substring(0, 15)}...
//                   </p>
//                 </div>
//               </div>

//               {/* Render a RequestModal for each buddy */}
//               <RequestModal
//                 sender={user}
//                 recipient={buddy}
//                 msgAlert={msgAlert}
//               />
//             </div>
//           ))}
//         </div>
//       </Segment>
//     </>
//   );
// };

// export default MessagesPage;



import React, { useState, useEffect } from "react";
import { Segment, Image, Button, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { getMyMessages } from "../../api/message";
import { getMyBuddies } from "../../api/user";
import RequestModal from "../user/RequestModal";

const MessagesPage = ({ user, msgAlert }) => {
  const [messages, setMessages] = useState([]);
  const [buddies, setBuddies] = useState([]);

  useEffect(() => {
    getMyMessages(user)
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch((error) => {
        msgAlert({
          heading: "Error",
          message: "Failed to load messages: " + error.message,
          variant: "danger",
        });
      });
  }, [user, msgAlert]);

  useEffect(() => {
    getMyBuddies(user)
      .then((res) => {
        setBuddies(res.data.buddies || []);
      })
      .catch((error) => {
        msgAlert({
          heading: "Error",
          message: "Failed to load buddies: " + error.message,
          variant: "danger",
        });
      });
  }, [user, msgAlert]);

  const getLastMessages = () => {
    const uniqueMessages = {};
    messages.forEach((message) => {
      const otherUser =
        message.owner?._id === user._id ? message.recipient : message.owner;

      if (
        otherUser &&
        (!uniqueMessages[otherUser._id] ||
          new Date(message.createdAt) >
            new Date(uniqueMessages[otherUser._id]?.createdAt))
      ) {
        uniqueMessages[otherUser._id] = { ...message, otherUser };
      }
    });
    return uniqueMessages;
  };

  const lastMessagesByBuddy = buddies.map((buddy) => {
    const lastMessage = getLastMessages()[buddy._id] || {
      content: "No messages yet.",
      owner: user,
      otherUser: buddy,
    };

    return { buddy, lastMessage };
  });

  return (
    <Segment>
      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        Your Messages
      </Header>
      <div>
        {lastMessagesByBuddy.map(({ buddy, lastMessage }) => (
          buddy && lastMessage && (
            <div
              key={buddy._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Link to={`/user-public-page/${buddy._id}`}>
                  <Image
                    src={buddy.avatar || "/default-avatar.png"}
                    size="tiny"
                    circular
                    style={{ marginRight: "10px" }}
                  />
                </Link>
                <div>
                  <Link
                    to={`/user-public-page/${buddy._id}`}
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.2em",
                      margin: 0,
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {buddy.username || buddy.email}
                  </Link>
                  <p style={{ fontSize: "0.9em", color: "#555", margin: 0 }}>
                    {lastMessage.content.substring(0, 15)}...
                  </p>
                </div>
              </div>
              <RequestModal
                sender={user}
                recipient={buddy}
                msgAlert={msgAlert}
              />
            </div>
          )
        ))}
      </div>
    </Segment>
  );
};

export default MessagesPage;