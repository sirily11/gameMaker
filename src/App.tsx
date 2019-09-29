import React, { Component } from "react";
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
import Dashboard from "./Components/Dashboard/Dashboard";
import { EditContext, EditProvider } from "./Components/models/editState";
import "./App.css";
import EditPage from "./Components/EditPage/EditPage";

class App extends Component {
  render() {
    return (
      <EditProvider>
        <HashRouter>
          <div>
            <Switch>
              {/* <Route
              exact
              path="/"
              render={props =>
                !this.state.logined ? (
                  <Login
                    {...props}
                    login={() => {
                      this.setState({ logined: true });
                    }}
                  />
                ) : (
                  <Redirect to="/home" />
                )
              }
            /> */}
              <Route exact path="/home" render={props => <Home />} />
              {/* <Route
              exact
              path="/survey/:sid"
              render={props => <DisplaySurvey {...props} />}
            />
            <Route
              exact
              path="/edit/survey/:sid"
              render={props => <EditSurvey {...props} />}
            /> */}
              <Route exact path="/edit" render={props => <EditPage />} />
              <Route
                path="/dashboard"
                render={props => <Dashboard {...props} />}
              />
            </Switch>
          </div>
        </HashRouter>
      </EditProvider>
    );
  }
}

export default App;
