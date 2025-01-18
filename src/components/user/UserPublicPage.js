import React, { useState, useEffect } from "react";
import { Button, Segment, Grid, Image, Container } from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import { createMessage } from "../../api/message";
import { getUserInfo } from "../../api/user";
import { getTheirActivities } from "../../api/activity";

import ActivitySegment from "../activities/ActivitySegment";
import BadgesSegment from "../badges/BadgesSegment";
import LoadingScreen from "../shared/LoadingPage";

const UserPublicPage = ({ currentUser, msgAlert, triggerRefresh }) => {
  const { otherUserId } = useParams(); // User ID from URL
  const [publicActivities, setPublicActivities] = useState(null);
  const [email, setEmail] = useState("");
  const [thisUser, setThisUser] = useState({});
  const [createdDate, setCreatedDate] = useState("");
  const [createdAvatar, setAvatar] = useState("");
  const [badges, setBadges] = useState(null);
  const [isBuddy, setIsBuddy] = useState(false);

  // Fetch user activities and profile information
  useEffect(() => {
    getTheirActivities(currentUser, otherUserId)
      .then((res) => {
        setPublicActivities(res.data.activities.reverse());
        setBadges(
          res.data.userBadges.filter((badge) => badge.level !== "none")
        );
      })
      .catch((error) =>
        msgAlert({
          heading: "Error",
          message: "Could not get user activities: " + error,
          variant: "danger",
        })
      );
  
    getUserInfo(currentUser, otherUserId)
      .then((res) => {
        setEmail(res.data.user.email);
        setCreatedDate(res.data.user.createdDate);
        setAvatar(res.data.user.avatar);
        setThisUser(res.data.user);
  
        console.log(currentUser.buddies, "buddies already");
  
        // Check if the user is already a buddy
        const isAlreadyBuddy = currentUser.buddies.some(
          (buddy) => buddy._id === otherUserId
        );
        setIsBuddy(isAlreadyBuddy);
      })
      .catch((error) =>
        msgAlert({
          heading: "Error",
          message: "Could not get user info: " + error,
          variant: "danger",
        })
      );
  }, [currentUser, otherUserId, msgAlert]);

  // Handle friendship request
  const handleRequestFriendship = () => {
    const newMessage = {
      recipient: otherUserId,
      owner: currentUser._id,
      content: "none",
      isBuddyMessage: true,
    };

    createMessage(currentUser, newMessage)
      .then(() => {
        msgAlert({
          heading: "Success",
          message: "Friendship request sent successfully!",
          variant: "success",
        });
        triggerRefresh();
      })
      .catch((error) => {
        msgAlert({
          heading: "Error",
          message: "Failed to send friendship request: " + error,
          variant: "danger",
        });
      });
  };

  // JSX for activities
  const activitiesJSX = publicActivities ? (
    publicActivities.map((activity) => (
      <ActivitySegment
        key={activity.id}
        activity={activity}
        user={currentUser}
        msgAlert={msgAlert}
        mine={false}
      />
    ))
  ) : (
    <LoadingScreen />
  );

  return (
    <div>
      <Segment raised inverted color="yellow">
        <Grid.Row>
          <Segment>
            <Grid columns={2}>
              <Grid.Column width={8} verticalAlign="center" textAlign="middle">
                <Grid columns={2}>
                  <Grid.Column width={5} textAlign="middle">
                    <Image
                      src={createdAvatar}
                      size="small"
                      circular
                      centered
                      alt="User avatar"
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="middle">
                    <h1>{email}</h1>
                    <h2>Member since {createdDate}</h2>
                    {currentUser._id !== otherUserId && !isBuddy && (
                      <Container className="justify-content-center">
                        <Button onClick={handleRequestFriendship}>
                          Add Buddy
                        </Button>
                      </Container>
                    )}
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Row>
        <br />
        <Grid columns={2} padded>
          <Grid.Column width={8}>
            <Grid columns={2} padded centered>
              <BadgesSegment
                badges={badges}
                badgeOwnerHandle={email}
                mine={false}
                activities={publicActivities}
              />
            </Grid>
          </Grid.Column>
          <Grid.Column>
            <Segment raised textAlign="center">
              <h1>{email}'s Activity Timeline</h1>
              <div className="scrolling-group">{activitiesJSX}</div>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
};

export default UserPublicPage;