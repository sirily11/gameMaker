import React, { Component, useContext } from "react";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import { EditContext, EditProvider } from "./Components/models/editState";
import "./App.css";
import EditPage from "./Components/EditPage/EditPage";
import SignUpSide from "./Components/Login/SignUp";
import { UserProvider, UserContext } from "./Components/models/userState";

export default function App() {
  const userContext = useContext(UserContext);
  const { isLogin } = userContext;
  console.log(isLogin);

  return (
    <EditProvider>

        <HashRouter>
          <div>
            <Switch>
              <Route
                exact
                path="/"
                render={props =>
                  isLogin ? <Redirect to="/home" /> : <Login />
                }
              ></Route>
              <Route
                exact
                path="/signUp"
                render={props =>
                  isLogin ? <Redirect to="/home" /> : <SignUpSide />
                }
              ></Route>
              <Route
                exact
                path="/home"
                render={props => (!isLogin ? <Redirect to="/" /> : <Home />)}
              />
              <Route
                exact
                path="/edit/:id"
                render={props => <EditPage {...props} />}
              />
            </Switch>
          </div>
        </HashRouter>

    </EditProvider>
  );
}
