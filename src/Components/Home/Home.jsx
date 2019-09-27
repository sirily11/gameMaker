import React, { Component } from "react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, NavLink, Redirect } from "react-router-dom";
import $ from "jquery";
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
  Grow,
  LinearProgress,
  Fade,
  Hidden,
  Icon,
  Fab
} from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import lightBlue from "@material-ui/core/colors/lightBlue";
import getURL from "../settings";
import DrawerNav from "./DrawerNav";
import "bootstrap/dist/css/bootstrap.min.css";

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: lightBlue
  }
});

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      survey_list: [],
      open_dialog: false,
      survey_name: "",
      error: "",
      showCard: false,
      loading: false,
      width: window.innerWidth,
      isEdit: false,
      sid: "",
      open: false // open drawer
    };
  }

  getAllSurvey = () =>
    $.ajax({
      method: "GET",
      url: getURL("survey/"),
      success: data => {
        this.setState({ survey_list: data, loading: false });
      }
    });

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({ width: window.innerWidth });
    });
    this.setState({ loading: true });
    this.getAllSurvey();

    setTimeout(() => {
      this.setState({ showCard: true, loading: false });
    }, 100);
  }

  renderSurveyCard() {
    return this.state.survey_list.map((survey, index) => {
      return (
        <div className="col-md-4 col-sm-6 col-12 mt-4" key={index}>
          <Grow in={this.state.showCard}>
            <Card className="h-100" id={survey.id}>
              <CardContent className="d-flex">
                <h5 className="ml-auto mr-auto">
                  {" "}
                  <AssignmentIcon />
                  {survey.title}{" "}
                  <IconButton
                    onClick={() => {
                      this.setState({
                        open_dialog: true,
                        isEdit: true,
                        survey_name: survey.title,
                        sid: survey.id
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      this.removeSurvey(survey.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </h5>
              </CardContent>
              <div className="d-flex">
                <div className="ml-auto mr-auto">
                  <Link to={`/edit/survey/${survey.id}`}>
                    <Button>Edit</Button>
                  </Link>
                  <Link to={`/survey/${survey.id}`}>
                    <Button>Take</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Grow>
        </div>
      );
    });
  }

  handleCloseDialog = () => {
    this.setState({
      open_dialog: false,
      error: ""
    });
  };

  showAddSurvey = () => {
    this.setState({ open_dialog: true });
  };

  addSurvey = () => {
    this.setState({ loading: true });
    $.ajax({
      contentType: "application/json",
      method: "POST",
      data: JSON.stringify({
        title: this.state.survey_name
      }),
      url: getURL("survey/"),
      success: data => {
        this.setState({
          open_dialog: false,
          survey_name: ""
        });
        this.getAllSurvey();
      }
    });
  };

  editSurvey = (sid, title) => {
    console.log(sid,title)
    this.setState({ loading: true });
    $.ajax({
      method: "PATCH",
      contentType: "application/json",
      data: JSON.stringify({ title: title }),
      url: getURL(`survey/${sid}/`),
      success: data => {
        this.setState({ survey_name: "", isEdit: false, open_dialog: false });
        this.getAllSurvey();
      }
    });
  };

  removeSurvey = sid => {
    this.setState({ loading: true });
    $.ajax({
      method: "DELETE",
      url: getURL(`survey/${sid}/`),
      success: data => {
        this.getAllSurvey();
      }
    });
  };

  renderDialog() {
    return (
      <Dialog
        open={this.state.open_dialog}
        onClose={this.handleCloseDialog}
        fullWidth
      >
        <DialogTitle>Create New Survey</DialogTitle>
        <DialogContent>
          <div style={{ color: "red" }}>{this.state.error}</div>
          <div className="row">
            <TextField
              fullWidth
              value={this.state.survey_name}
              onChange={e => {
                this.setState({
                  survey_name: e.target.value
                });
              }}
              label="Survey Name"
            />
          </div>
        </DialogContent>

        <DialogActions>
          <div>
            <Button
              onClick={() => {
                if (!this.state.isEdit) {
                  this.addSurvey();
                } else {
                  this.editSurvey(this.state.sid, this.state.survey_name);
                }
              }}
            >
              Ok
            </Button>
            <Button onClick={this.handleCloseDialog}>Cancel</Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  }

  renderNavBar() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            style={{ color: "white" }}
            onClick={() => {
              let open = this.state.open;
              this.setState({ open: !open });
            }}
          >
            <MenuIcon />
          </IconButton>
          Survey
        </Toolbar>
      </AppBar>
    );
  }

  notLoginException() {
    let login = localStorage.getItem("isLogined");
    console.log(login);
    if (login !== "true") {
      console.log("Not logined");
      return true;
    }
  }

  render() {
    if (this.notLoginException() === true) {
      return <Redirect to="/" />;
    }
    return (
      <MuiThemeProvider theme={theme}>
        <DrawerNav
          pageName={"Home"}
          isPermanent={this.state.width >= 768}
          open={this.state.open}
          close={() => {
            this.setState({ open: false });
          }}
        />
        <div style={{ marginLeft: this.state.width >= 768 ? "180px" : "0px" }}>
          {this.renderNavBar()}
          <Fade in={this.state.loading} timeout={{ exit: 1000 }}>
            <LinearProgress color="secondary" />
          </Fade>
          <div className="container-fluid mt-3">
            <div className="row">
              {this.renderSurveyCard()}
              <div className="col-md-4 col-sm-6 col-12 mt-4 row">
                <Fab className="mx-auto my-auto" onClick={this.showAddSurvey}>
                  <AddIcon />
                </Fab>
              </div>
            </div>
            {this.renderDialog()}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
