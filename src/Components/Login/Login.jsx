import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CardContent,
  TextField,
  Button,
  Slide,
  Collapse,
  CardActions
} from "@material-ui/core";
import color from "@material-ui/core/colors/blue";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      height: window.innerHeight,
      password: "",
      username: "",
      login_err: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({ height: window.innerHeight });
    });
  }

  login = () => {
    if (this.state.password === "1234" && this.state.username === "sirily11") {
      localStorage.setItem("isLogined",true)
      this.props.login();
    } else {
      this.setState({ login_err: true });
    }
  };

  render() {
    return (
      <div
        className="container-fluid"
        style={{ height: this.state.height, backgroundColor: "grey" }}
      >
        <div className="d-flex h-100">
          <div className="my-auto ml-auto mr-auto">
            <Card>
              <CardContent>
                <h4>Login</h4>
                <Collapse in={this.state.login_err}>
                  <div style={{ color: "red" }}>Wrong username or password</div>
                </Collapse>
                <div>
                  <TextField
                    fullWidth
                    label="User name"
                    onChange={e => {
                      this.setState({ username: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    onChange={e => {
                      this.setState({ password: e.target.value });
                    }}
                  />
                </div>
                <CardActions>
                  <Button onClick={this.login}>Login</Button>
                </CardActions>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
