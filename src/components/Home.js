import IndexActivity from "./activities/IndexActivity";
import LoginPage from "./LoginPage/LoginPage";

const Home = ({ msgAlert, getCurrentUser, user, setUser }) => {
  return (
    <>
      <LoginPage  msgAlert={msgAlert} getCurrentUser={getCurrentUser} user={user} setUser={setUser}/>
    </>
  );
};

export default Home;
