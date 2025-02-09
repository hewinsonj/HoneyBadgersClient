import apiUrl from "../apiConfig";
import axios from "axios";

export const getMessagesBetweenUsers = (user1Id, user2Id) => {
  return axios.get(`/messages/between/${user1Id}/${user2Id}`, {
    headers: {
      Authorization: `Token token=${user1Id}`,
    },
  });
};

//get all activities (unless marked private)
//data returned: res.data.activities will have all public activities
export const getAllMessages = () => {
  return axios({
    method: "GET",
    url: `${apiUrl}/messages`,
  });
};
// For Search Bar to filter all Activities
// export const searchActivities = (searchText) => {
//     return axios({
//         method: 'POST',
//         url: `${apiUrl}/activities`,
//         data: searchText
//         })
//     }

//get the logged-in user's activities
//data returned: res.data.activities has all of the user's activities
//res.data.completedCounts is an object w/ the number of completed activities per category (ex: res.data.completedCounts.eduction will be 2 if the user has completed 2 activities)
export const getMyMessages = (user) => {
  return axios({
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    url: `${apiUrl}/messages/mine`,
  });
};

//get a single activity
//data returned: res.data.activity is the activity object itself (including all notes as res.data.notes)
//res.data.publicNotes has all notes associated with the activity which have been marked a private by their authors
//res.data.privateViewableNotes has all notes in the activity which have been marked private BUT which were authored by the current user making the request
export const getMessage = (user, messageId) => {
  return axios({
    method: "GET",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    url: `${apiUrl}/messages/${messageId}`,
  });
};

//create an activity
//data returned: res.data.activity will be the new activity
export const createMessage = (user, newMessage) => {
  return axios({
    method: "POST",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    url: apiUrl + "/messages",
    data: {
      message: newMessage,
    },
  });
};

//delete an activity
//nothing returned
export const deleteMessage = (user, messageId) => {
  return axios({
    method: "DELETE",
    headers: {
      Authorization: `Token token=${user.token}`,
    },
    url: `${apiUrl}/messages/${messageId}`,
  });
};
