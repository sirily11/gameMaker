import React, { Component } from "react";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import DisplaySurvey from "./Components/Survey/DisSurvey";
import EditSurvey from "./Components/Survey/ESurvey";
import Dashboard from "./Components/Dashboard/Dashboard";

class App extends Component {
  constructor() {
    super();
    this.state = {
      logined: false
    };
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route
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
            />
            <Route exact path="/home" render={props => <Home {...props} logined={this.state.logined} />} />
            <Route
              exact
              path="/survey/:sid"
              render={props => <DisplaySurvey {...props} />}
            />
            <Route
              exact
              path="/edit/survey/:sid"
              render={props => <EditSurvey {...props} />}
            />
            <Route
              path="/dashboard"
              render={props => <Dashboard {...props} />}
            />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
