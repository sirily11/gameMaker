import React, { Component } from "react";
import $ from "jquery";
import getURL from "../settings";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DoneIcon from "@material-ui/icons/Done";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link, NavLink, Redirect } from "react-router-dom";
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  AppBar,
  Toolbar,
  Paper,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  IconButton,
  Collapse,
  Fade,
  Radio,
  LinearProgress,
  Card,
  CardActionArea,
  CardMedia,
  CardHeader,
  CardContent,
  Fab,
  CircularProgress
} from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import { UserSelections } from "./UserSelections/UserSelections";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      light: "#80e27e",
      main: "#087f23",
      dark: "#ba000d",
      contrastText: "#000"
    }
  }
});

const styles = theme => ({
  media: {
    height: 0,
    paddingTop: "58.25%", // 16:9,
    backgroundPosition: "center center",
    backgroundSize: "cover"
  },
  card: {
    borderRadius: "18px"
  }
});

/**
 * User selections should look like this
 * [{
 *  time_takes: 0,
 *  selected: 0 //index of the selection
 * }]
 */
class DisplaySurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      loading: false,
      userSelections: null,
      currentPage: 0,
      treeHeight: 1,
      uid: null,
      sid: null,
      isSubmited: false
    };
    this.userSelections = new UserSelections();
    let date = new Date();
    this.t1 = date.getTime();
  }

  componentDidMount() {
    this.setState({ loading: true });
    window.addEventListener("resize", () => {
      this.setState({ width: window.innerWidth });
    });
    let sid = this.props.match.params.sid;
    if (sid === undefined) return;
    this.setState({ sid: sid });
    $.ajax({
      method: "GET",
      crossDomain: true,
      url: getURL(`survey/${sid}/`),
      success: (data)=>{
        
        let survey = data
        this.userSelections.setQuestionData(survey);
        this.setState({
          userSelections: this.userSelections,
          loading: false,
          title: this.userSelections.title
        });
      }
    })
  }

  createUser() {
    return new Promise((resolve, reject) => {
      if (this.state.uid !== null) {
        return resolve();
      }
      // $.post(getURL("start/survey/" + this.state.sid), data => {
      //   if (data.status === "success") {
      //     this.setState({ uid: data.uid });
      //     return resolve();
      //   }
      // });
    });
  }

  updateTime() {
    let date = new Date();
    let t2 = date.getTime();
    let time_takes = (t2 - this.t1) / 1000;
    this.t1 = t2;
    return time_takes;
  }

  /**
   * Go to next problem
   */
  next = () => {
    let userSelections = this.state.userSelections;
    let finish = this.state.userSelections.isFinished();
    let hasNext = this.state.userSelections.hasNext();
    let time_takes = this.updateTime();
    let currentPage = this.state.currentPage;
    this.createUser().then(() => {
      if (this.isFinished(finish, hasNext)) {
        this.finish(time_takes, userSelections);
      } else {
        userSelections.next(time_takes);
        let height = currentPage + 1 + userSelections.getMaxDepthOfTree();
        this.setState({
          userSelections: userSelections,
          currentPage: currentPage + 1,
          treeHeight: height
        });
      }
    });
  };

  isFinished(finish, hasNext) {
    if (!finish && !hasNext) {
      return true;
    } else if (finish) {
      return true;
    }
    return false;
  }

  /**
   * Go to prev problem
   */
  prev = () => {
    let userSelections = this.state.userSelections;
    let currentPage = this.state.currentPage;
    userSelections.prev();
    let height = currentPage - 1 + userSelections.getMaxDepthOfTree();
    this.setState({
      userSelections: userSelections,
      currentPage: currentPage - 1,
      treeHeight: height
    });
  };

  finish(time_takes, userSelections) {
    let questions = userSelections.submit(time_takes);
    let data = JSON.stringify({
      data: questions,
      uid: this.state.uid
    });
    this.setState({ loading: true });
    $.ajax({
      contentType: "application/json",
      method: "POST",
      data: data,
      url: getURL("add/multiple/user/selection"),
      success: data => {
        this.setState({ loading: false, isSubmited: true });
      }
    });
  }

  select(selection_id) {
    let userSelections = this.state.userSelections;
    userSelections.select(selection_id);
    this.setState({ userSelections: userSelections });
  }

  renderSelections() {
    return (
      this.state.userSelections !== null &&
      this.state.userSelections.currentQuestion !== null &&
      this.state.userSelections.currentQuestion.selections.map(
        (selection, index) => {
          return (
            <Fade in={true} key={index}>
              <ListItem>
                <Radio
                  checked={selection.isSelected}
                  onChange={this.select.bind(this, selection.sid)}
                />
                <ListItemText>{selection.title}</ListItemText>
              </ListItem>
            </Fade>
          );
        }
      )
    );
  }

  renderNavBar() {
    return (
      <AppBar
        position="fixed"
        style={{
          height:window.innerHeight/4,
          zIndex: 10,
          boxShadow: "none",
         }}
      >
        <Toolbar variant="dense">
          <IconButton>
            <Link style={{ color: "white" }} to="/home">
              <ArrowBackIcon />
            </Link>
          </IconButton>{" "}
          {this.state.title}
        </Toolbar>
      </AppBar>
    );
  }

  renderNextButtonText() {
    let finish = this.state.userSelections.isFinished();
    let hasNext = this.state.userSelections.hasNext();
    if (!finish && !hasNext) {
      return "Submit";
    }
    if (finish) {
      return "Submit";
    }
    return "Next";
  }

  render() {
    const { classes } = this.props;

    if (this.state.back) {
      return <Redirect to="/home" />;
    }
    return (
      <MuiThemeProvider theme={theme}>
        {this.renderNavBar()}
        <div
          className="mx-auto col-lg-6 col-md-8 col-12"
          style={{ zIndex: 1000, marginTop: 90}}
        >
          {this.state.userSelections !== null && this.state.userSelections.currentQuestion !== undefined && (
            <Card className={classes.card} elevation={6}>
              <CardHeader
                title={this.state.userSelections.currentQuestion.title}
              />
              <LinearProgress
                color="secondary"
                variant="determinate"
                value={(this.state.currentPage / this.state.treeHeight) * 100}
              />
              <Collapse
                in={this.state.userSelections.currentQuestion.image !== null}
                timeout={800}
                unmountOnExit
                mountOnEnter
              >
                <CardMedia
                  style={{ height: "300px" }}
                  image={this.state.userSelections.currentQuestion.image}
                />
              </Collapse>

              <CardContent>
                {!this.state.isSubmited && (
                  <div>
                    <span>
                      {this.state.userSelections.currentQuestion.description}
                    </span>
                    <List>{this.renderSelections()}</List>
                  </div>
                )}
                {this.state.isSubmited && (
                  <div className="row" style={{ height: "200px" }}>
                    {" "}
                    <h4 className="mx-auto my-auto">Thank you</h4>
                  </div>
                )}
                {!this.state.isSubmited && (
                  <div className="row p-1">
                    <div className="col-4 d-flex">
                      <Button
                        className="ml-auto mr-auto"
                        disabled={!this.state.userSelections.hasPrev()}
                        onClick={this.prev}
                      >
                        Prev
                      </Button>
                    </div>
                    <div className="col-4 d-flex" />
                    <div className="col-4 d-flex">
                      <Button
                        className="ml-auto mr-auto"
                        disabled={
                          this.state.userSelections.currentQuestion.selected ===
                          undefined
                        }
                        onClick={this.next}
                        variant="contained"
                        color="primary"
                      >
                        {this.renderNextButtonText()}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>

              <Fab
                style={{
                  position: "absolute",
                  zIndex: 100,
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                  bottom: -30,
                  backgroundColor: this.state.loading ? "#2196f3" : "#43a047"
                }}
              >
                <Fade in={this.state.loading} mountOnEnter unmountOnExit>
                  <CircularProgress
                    size={60}
                    style={{ color: "#1e88e5", position: "absolute" }}
                  />
                </Fade>
                <Fade
                  in={!this.state.loading && !this.state.isSubmited}
                  mountOnEnter
                  unmountOnExit
                >
                  <DoneIcon style={{ color: "white" }} />
                </Fade>
                <Fade in={this.state.isSubmited} mountOnEnter unmountOnExit>
                  <Link style={{ color: "white" }} to="/home">
                    <ArrowBackIcon />
                  </Link>
                </Fade>
              </Fab>
            </Card>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

DisplaySurvey.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DisplaySurvey);
