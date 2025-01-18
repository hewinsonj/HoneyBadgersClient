import React, { useState } from "react";
import { Modal, Button } from "semantic-ui-react";
import ActivityForm from "../shared/ActivityForm";
import { updateActivity, randomActivity } from "../../api/activity";

const UpdateActivityModal = (props) => {
  const { user, msgAlert, triggerRefresh } = props;

  const [activity, setActivity] = useState(props.activity);
  const [open, setOpen] = useState(false);

  const handleChange = (e, target) => {
    setActivity((prevActivity) => {
      const { name, value } = target;
      const updatedName = name;
      let updatedValue = value;

      // Handle number type
      if (target.type === "number") {
        updatedValue = parseInt(e.target.value);
      }

      // Handle the checkbox
      if (updatedName === "private" && target.checked) {
        updatedValue = true;
      } else if (updatedName === "private" && !target.checked) {
        updatedValue = false;
      }

      const updatedActivity = { [updatedName]: updatedValue };

      return { ...prevActivity, ...updatedActivity };
    });
  };

  const handleUpdateActivity = (e) => {
    e.preventDefault();

    if (activity === props.activity) {
      setOpen(false);
    } else {
      updateActivity(user, activity, props.activity._id)
        .then(() => {
          setOpen(false);
          triggerRefresh();
          msgAlert({
            heading: "Success",
            message: "Updated Activity",
            variant: "success",
          });
        })
        .catch((error) => {
          setOpen(false);
          msgAlert({
            heading: "Failure",
            message: "Update Activity Failure" + error,
            variant: "danger",
          });
        });
    }
  };

  const handleRandomActivity = (e) => {
    e.preventDefault();

    randomActivity(user)
      .then((jsonData) => {
        setActivity((prevActivity) => {
          return {
            ...prevActivity,
            activity: jsonData.data.activity,
            type: jsonData.data.type,
            accessibility: jsonData.data.accessibility,
            participants: jsonData.data.participants,
            price: jsonData.data.price,
          };
        });
        msgAlert({
          heading: "Success",
          message: "Random activity loaded!",
          variant: "success",
        });
      })
      .catch((error) => {
        msgAlert({
          heading: "Failure",
          message: "Failed to load random activity: " + error,
          variant: "danger",
        });
      });
  };

  return (
    <Modal
      onClose={() => {
        setOpen(false);
        setActivity(props.activity);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button onClick={() => setActivity(props.activity)}>
          Update Activity
        </Button>
      }
    >
      <Modal.Content>
        <ActivityForm
          user={user}
          msgAlert={msgAlert}
          activity={activity}
          handleChange={handleChange}
          handleSubmit={handleUpdateActivity}
          handleActivity={handleRandomActivity} // Pass the handleRandomActivity function
          heading="Update Your Activity"
        />
      </Modal.Content>
    </Modal>
  );
};

export default UpdateActivityModal;