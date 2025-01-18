// // import React, { Component } from "react";
// // import { Menu, Icon, Sticky, Modal } from "semantic-ui-react";
// // import CreateActivity from "../activities/CreateActivity";
// // import { signIn } from "../../api/auth";
// // import UserPublicPage from "../user/UserPublicPage";
// // import { Link } from "react-router-dom";

// // const linkStyle = {
// //   color: "black",
// //   textDecoration: "none",
// // };

// // export default class Header extends Component {
// //   state = {
// //     activeItem: "home",
// //     setOpen: false,
// //     newActivity: false,
// //   };

// //   // const onGuestSignIn = (event) => {
// //   //   event.preventDefault();

// //   //   // Predefined guest credentials
// //   //   const guestCredentials = {
// //   //     email: "guest@gmails.com",
// //   //     password: "pop",
// //   //   };

// //   //   signIn(guestCredentials)
// //   //     .then((res) => setUser(res.data.user))
// //   //     .then(() =>
// //   //       msgAlert({
// //   //         heading: "Welcome, Guest!",
// //   //         message: messages.signInSuccess,
// //   //         variant: "success",
// //   //       })
// //   //     )
// //   //     .then(() => navigate("/user-page")) // Redirect to a guest-specific page
// //   //     .catch((error) => {
// //   //       msgAlert({
// //   //         heading: "Guest Sign In Failed: " + error.message,
// //   //         message: messages.signInFailure,
// //   //         variant: "danger",
// //   //       });
// //   //     });
// //   // };

// //   handleItemClick = (e, { name }) => this.setState({ activeItem: name });
// //   handleClose = () => {
// //     this.setState({ setOpen: false });
// //   };

// //   render() {
// //     const { activeItem } = this.state;
// //     const linkStyle = {
// //       color: "black",
// //       textDecoration: "none",
// //     };

// //     return (
// //       <div>
// //         <Sticky>
// //           <Menu inverted pointing secondary size="massive" id="header">
// //             <Menu.Item
// //               name="honey badges"
// //               active={activeItem === "honey badges"}
// //               onClick={this.handleItemClick}
// //             >
// //               <Link to="/">
// //                 <Icon name="certificate" />
// //                 Honey badges
// //               </Link>
// //             </Menu.Item>

// //             {
// //               this.props.user ? (
// //                 // AUTHINTICATED OPTIONS
// //                 <Menu.Menu position="right">
// //                   <Modal
// //                     onClose={() => this.handleClose()}
// //                     onOpen={() => this.setState({ setOpen: true })}
// //                     open={this.state.setOpen}
// //                     trigger={
// //                       <Menu.Item
// //                         name="New Activity"
// //                         active={activeItem === "new activities"}
// //                         onClick={this.handleItemClick}
// //                       >
// //                         <Link to="user-page">New Activity</Link>
// //                       </Menu.Item>
// //                     }
// //                   >
// //                     <Modal.Content>
// //                       <CreateActivity
// //                         user={this.props.user}
// //                         setNewActivity={this.props.setNewActivity}
// //                         msgAlert={this.props.msgAlert}
// //                         handleClose={this.handleClose}
// //                       />
// //                     </Modal.Content>
// //                   </Modal>
// //                   <Menu.Item
// //                     name="search"
// //                     active={activeItem === "search"}
// //                     onClick={this.handleItemClick}
// //                   >
// //                     <Link to={`/activities`}>Search</Link>
// //                   </Menu.Item>
// //                   <Menu.Item
// //                     name="feed page"
// //                     active={activeItem === "feed page"}
// //                     onClick={this.handleItemClick}
// //                   >
// //                     <Link to={`feed-page/${this.props.user._id}`}>Feed</Link>
// //                   </Menu.Item>
// //                   <Menu.Item
// //                     name="my public profile"
// //                     active={activeItem === "my public profile"}
// //                     onClick={this.handleItemClick}
// //                   >
// //                     <Link to={`user-public-page/${this.props.user._id}`}>
// //                       Public Profile
// //                     </Link>
// //                   </Menu.Item>
// //                   <Menu.Item
// //                     name="private profile"
// //                     active={activeItem === "private profile"}
// //                     onClick={this.handleItemClick}
// //                   >
// //                     <Link to="user-page">Private Profile</Link>
// //                   </Menu.Item>
// //                   <Menu.Item
// //                     name="sign out"
// //                     active={activeItem === "sign out"}
// //                     onClick={this.handleItemClick}
// //                   >
// //                     <Link to="sign-out">Sign Out</Link>
// //                   </Menu.Item>
// //                   <Menu.Item
// //                     name="change password"
// //                     active={activeItem === "change password"}
// //                     onClick={this.handleItemClick}
// //                   >
// //                     <Link to="change-password">Change Password</Link>
// //                   </Menu.Item>
// //                 </Menu.Menu>
// //               ) : // UNAUTHINTICATED OPTIONS
// //             <Form onSubmit={onGuestSignIn}>
// //               <Button
// //                 secondary
// //                 inverted
// //                 color="yellow"
// //                 className="guestButton"
// //                 type="submit"
// //               >
// //                 Continue as Guest
// //               </Button>
// //             </Form>

// //               // <Menu.Menu position='right'>
// //               // 	<>
// //               // 		<Menu.Item
// //               // 			name='user access'
// //               // 			active={activeItem === 'user access'}
// //               // 			onClick={this.handleItemClick}
// //               // 			href='sign-page'
// //               // 		></Menu.Item>
// //               // 	</>
// //               // </Menu.Menu>
// //             }
// //           </Menu>
// //         </Sticky>
// //       </div>
// //     );
// //   }
// // }

// import React, { useState } from "react";
// import { Menu, Icon, Sticky, Modal, Button, Form } from "semantic-ui-react";
// import CreateActivity from "../activities/CreateActivity";
// import { signIn } from "../../api/auth";
// import { Link, useNavigate } from "react-router-dom";

// const Header = ({ user, setUser, setNewActivity, msgAlert }) => {
//   const [activeItem, setActiveItem] = useState("home");
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const onGuestSignIn = (event) => {
//     event.preventDefault();

//     // Predefined guest credentials
//     const guestCredentials = {
//       email: "guest@gmails.com",
//       password: "pop",
//     };

//     signIn(guestCredentials)
//       .then((res) => setUser(res.data.user))
//       .then(() =>
//         msgAlert({
//           heading: "Welcome, Guest!",
//           message: "You are signed in as a guest.",
//           variant: "success",
//         })
//       )
//       .then(() => navigate("/user-page")) // Redirect to a guest-specific page
//       .catch((error) => {
//         msgAlert({
//           heading: "Guest Sign In Failed",
//           message: error.message,
//           variant: "danger",
//         });
//       });
//   };

//   const handleItemClick = (e, { name }) => setActiveItem(name);

//   return (
//     <div>
//       <Sticky>
//         <Menu inverted pointing secondary size="massive" id="header">
//           <Menu.Item
//             name="honey badges"
//             active={activeItem === "honey badges"}
//             onClick={handleItemClick}
//           >
//             <Link to="/">
//               <Icon name="certificate" />
//               Honey Badges
//             </Link>
//           </Menu.Item>

//           {user ? (
//             // Authenticated Options
//             <Menu.Menu position="right">
//               <Modal
//                 onClose={() => setOpen(false)}
//                 onOpen={() => setOpen(true)}
//                 open={open}
//                 trigger={
//                   <Menu.Item
//                     name="new activities"
//                     active={activeItem === "new activities"}
//                     onClick={handleItemClick}
//                   >
//                     <Link to="user-page">New Activity</Link>
//                   </Menu.Item>
//                 }
//               >
//                 <Modal.Content>
//                   <CreateActivity
//                     user={user}
//                     setNewActivity={setNewActivity}
//                     msgAlert={msgAlert}
//                     handleClose={() => setOpen(false)}
//                   />
//                 </Modal.Content>
//               </Modal>
//               <Menu.Item
//                 name="search"
//                 active={activeItem === "search"}
//                 onClick={handleItemClick}
//               >
//                 <Link to={`/activities`}>Search</Link>
//               </Menu.Item>
//               <Menu.Item
//                 name="feed page"
//                 active={activeItem === "feed page"}
//                 onClick={handleItemClick}
//               >
//                 <Link to={`feed-page/${user._id}`}>Feed</Link>
//               </Menu.Item>
//               <Menu.Item
//                 name="my public profile"
//                 active={activeItem === "my public profile"}
//                 onClick={handleItemClick}
//               >
//                 <Link to={`user-public-page/${user._id}`}>Public Profile</Link>
//               </Menu.Item>
//               <Menu.Item
//                 name="private profile"
//                 active={activeItem === "private profile"}
//                 onClick={handleItemClick}
//               >
//                 <Link to="user-page">Private Profile</Link>
//               </Menu.Item>
//               <Menu.Item
//                 name="sign out"
//                 active={activeItem === "sign out"}
//                 onClick={handleItemClick}
//               >
//                 <Link to="sign-out">Sign Out</Link>
//               </Menu.Item>
//               <Menu.Item
//                 name="change password"
//                 active={activeItem === "change password"}
//                 onClick={handleItemClick}
//               >
//                 <Link to="change-password">Change Password</Link>
//               </Menu.Item>
//             </Menu.Menu>
//           ) : (
//             <Menu.Menu position="right">
//               <Menu.Item
//                 name="guest"
//                 active={activeItem === "guest"}
//                 onClick={handleItemClick}
//               >
//                 <Form onSubmit={onGuestSignIn}>
//                   <Button
//                     secondary
//                     // inverted
//                     color="yellow"
//                     className="guestButton"
//                     type="submit"
//                     // size='medium'
//                   >
//                     Continue as Guest
//                   </Button>
//                 </Form>
//               </Menu.Item>
//               <Menu.Item
//                 name="login"
//                 active={activeItem === "login"}
//                 onClick={handleItemClick}
//               >
//                 <Form >
//                 <Button
//                   secondary
//                   // inverted
//                   color="yellow"
//                   className="guestButton"
//                   onClick={() => navigate("/sign-in")} // Use navigate for programmatic navigation
//                   // size='small'
//                 >
//                   Login here
//                 </Button>
//                 </Form>
//               </Menu.Item>
//             </Menu.Menu>
//           )}
//         </Menu>
//       </Sticky>
//     </div>
//   );
// };

// export default Header;

import React, { useState } from "react";
import { Menu, Icon, Sticky, Modal, Button, Form } from "semantic-ui-react";
import CreateActivity from "../activities/CreateActivity";
import { signIn } from "../../api/auth";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ user, setUser, setNewActivity, msgAlert }) => {
  const [activeItem, setActiveItem] = useState("home");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onGuestSignIn = (event) => {
    event.preventDefault();

    // Predefined guest credentials
    const guestCredentials = {
      email: "guest@gmails.com",
      password: "pop",
    };

    signIn(guestCredentials)
      .then((res) => setUser(res.data.user))
      .then(() =>
        msgAlert({
          heading: "Welcome, Guest!",
          message: "You are signed in as a guest.",
          variant: "success",
        })
      )
      .then(() => navigate("/user-page")) // Redirect to a guest-specific page
      .catch((error) => {
        msgAlert({
          heading: "Guest Sign In Failed",
          message: error.message,
          variant: "danger",
        });
      });
  };

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);

    // Programmatic navigation based on the name
    switch (name) {
      case "honey badges":
        navigate("/");
        break;
      case "new activities":
        setOpen(true);
        break;
      case "search":
        navigate("/activities");
        break;
      case "feed page":
        navigate(`/feed-page/${user?._id}`);
        break;
      case "my public profile":
        navigate(`/user-public-page/${user?._id}`);
        break;
      case "private profile":
        navigate("/user-page");
        break;
      case "sign out":
        navigate("/sign-out");
        break;
      case "change password":
        navigate("/change-password");
        break;
        case "messages":
          navigate("/messages");
          break;
      default:
        break;
    }
  };

  return (
    <div>
      <Sticky>
        <Menu inverted pointing secondary size="massive" id="header">
          <Menu.Item
            name="honey badges"
            active={activeItem === "honey badges"}
            onClick={handleItemClick}
          >
            <Icon name="certificate" />
            Honey Badges
          </Menu.Item>

          {user ? (
            <Menu.Menu position="right">
              <Menu.Item
                name="new activities"
                active={activeItem === "new activities"}
                onClick={handleItemClick}
              >
                {/* <Modal
                  onClose={() => setOpen(false)}
                  open={open}
                  trigger={
                    <>
                      <Icon name="plus" />
                      New Activity
                    </>
                  }
                >
                  <Modal.Content>
                    <CreateActivity
                      user={user}
                      setNewActivity={setNewActivity}
                      msgAlert={msgAlert}
                      handleClose={() => setOpen(false)}
                    />
                  </Modal.Content>
                </Modal>
                 */}

                <Modal
                  onClose={() => setOpen(false)}
                  open={open}
                  trigger={
                    <Button
                      color="black"
                      class="signButton"
                      centered
                      textAlign="center"
                      verticalAlign="middle"
                    >
                      <Icon name="plus" />
                      New Activity
                    </Button>
                  }
                >
                  <Modal.Content>
                    <CreateActivity
                      user={user}
                      setNewActivity={setNewActivity}
                      msgAlert={msgAlert}
                      handleClose={() => setOpen(false)}
                    />
                  </Modal.Content>
                </Modal>
              </Menu.Item>

              <Menu.Item
                name="messages"
                active={activeItem === "messages"}
                onClick={handleItemClick}
              >
                <Icon name="comment" />
                Messages
              </Menu.Item>
              <Menu.Item
                name="search"
                active={activeItem === "search"}
                onClick={handleItemClick}
              >
                <Icon name="search" />
                Search
              </Menu.Item>
              <Menu.Item
                name="feed page"
                active={activeItem === "feed page"}
                onClick={handleItemClick}
              >
                <Icon name="rss" />
                Feed
              </Menu.Item>
              <Menu.Item
                name="my public profile"
                active={activeItem === "my public profile"}
                onClick={handleItemClick}
              >
                <Icon name="user" />
                Public Profile
              </Menu.Item>
              <Menu.Item
                name="private profile"
                active={activeItem === "private profile"}
                onClick={handleItemClick}
              >
                <Icon name="user secret" />
                Private Profile
              </Menu.Item>
              <Menu.Item
                name="change password"
                active={activeItem === "change password"}
                onClick={handleItemClick}
              >
                <Icon name="key" />
                Change Password
              </Menu.Item>
              <Menu.Item
                name="sign out"
                active={activeItem === "sign out"}
                onClick={handleItemClick}
              >
                <Icon name="sign-out" />
                Sign Out
              </Menu.Item>
            </Menu.Menu>
          ) : (
            <Menu.Menu position="right">
              <Menu.Item
                name="guest"
                active={activeItem === "guest"}
                onClick={handleItemClick}
              >
                <Form onSubmit={onGuestSignIn}>
                  <Button
                    secondary
                    color="yellow"
                    className="guestButton"
                    type="submit"
                  >
                    Continue as Guest
                  </Button>
                </Form>
              </Menu.Item>
              <Menu.Item
                name="login"
                active={activeItem === "login"}
                onClick={() => navigate("/sign-in")}
              >
                <Form>
                  <Button secondary color="yellow" className="guestButton">
                    Login here
                  </Button>
                </Form>
              </Menu.Item>
            </Menu.Menu>
          )}
        </Menu>
      </Sticky>
    </div>
  );
};

export default Header;
