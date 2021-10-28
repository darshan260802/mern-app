import styled from "styled-components";
import Navbar from "./Components/Navbar";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./Components/Login";
import Notes from "./Components/Notes";

const isLoggedIn = () => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    return true;
  }
  return false;
};

function App() {
  // Styling Area Start
  const FlexContainer = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  `;

  // Styling Area Stop

  return (
    <FlexContainer>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Redirect to={isLoggedIn() ? "/notes" : "/login"} />
        </Route>
        <Route exact path="/login" component={Login} />
        <Route exact path="/notes" component={Notes} />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </FlexContainer>
  );
}

export default App;
