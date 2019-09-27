import React, { Component } from "react";
import $ from "jquery";
import getURL from "../settings";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import LinkIcon from "@material-ui/icons/Link";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import { Link } from "react-router-dom";
import {
  MuiThemeProvider,
  createMuiTheme,
  AppBar,
  Toolbar,
  Paper,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  IconButton,
  Collapse,
  Slide,
  Grow,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Fab,
  Icon,
  LinearProgress,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
  DialogContentText,
  Tooltip
} from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import blue from "@material-ui/core/colors/blue";
const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

export default class DisplaySurvey extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      title: "", //Title
      sid: "", //Curent survey id
      qid: "", // the current editing question id
      selection_id: "", //Selection ID
      questions: [],
      imageSrc: "", //image src for edit and insert
      showAddQuestionDialog: false,
      questionName: "", // Question name for edit and insert
      questionDescription: "",
      selectionName: "", //selection name which show on edit window
      selectionNameObj: {},
      width: window.innerWidth,
      loading: false, //is loading
      selectionEditIndex: -1, //which selection is editing
      selectionAnchor: "", //selection position on screen
      toQuestionSelect: {} //to which question
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({
        width: window.innerHeight
      });
    });

    let sid = this.props.match.params.sid;
    this.setState({ sid: sid });
    if (sid === undefined) return;
    this.getData(sid);
  }
  handleCloseDialog = () => {
    this.hideEditSelectionDialog();
    this.setState({
      showAddQuestionDialog: false,
      questionName: "",
      questionDescription: "",
      selectionName: ""
    });
  };

  getData(sid) {
    this.setState({ loading: true });
    $.ajax({
      url: getURL(`survey/${sid}/`),
      success: data => {
        let title = data.title;
        let questions = data.questions;
        let toQuestion = {};

        for (let question of questions) {
          for (let selection of question.selections) {
            toQuestion[selection.id] = selection.to_question;
          }
        }
        this.setState({
          title: title,
          questions: questions,
          loading: false,
          toQuestionSelect: toQuestion
        });
      }
    });
  }

  hideEditSelectionDialog() {
    this.setState({ selection_id: "", selectionAnchor: "" });
  }

  showAddDialog = (edit, qid, index) => {
    if (!edit) {
      this.setState({
        showAddQuestionDialog: true,
        imageSrc: "",
        edit: false,
        questionName: "",
        questionDescription: ""
      });
    } else {
      let question = this.state.questions[index];
      this.setState({
        showAddQuestionDialog: true,
        edit: true,
        questionName: question.title,
        questionDescription: question.description,
        imageSrc: question.image,
        qid: qid
      });
    }
  };

  addQuestion = () => {
    $.ajax({
      contentType: "application/json",
      method: "POST",
      data: JSON.stringify({
        sid: this.state.sid,
        title: this.state.questionName,
        image: this.state.imageSrc,
        description: this.state.questionDescription
      }),
      url: getURL("question/"),
      success: data => {
        this.setState({
          showAddQuestionDialog: false
        });
        this.getData(this.state.sid);
      }
    });
  };

  editQuestion = () => {
    $.ajax({
      contentType: "application/json",
      method: "PATCH",
      data: JSON.stringify({
        title: this.state.questionName,
        image: this.state.imageSrc,
        description: this.state.questionDescription
      }),
      url: getURL(`question/${this.state.qid}/`),
      success: data => {
        this.setState({
          showAddQuestionDialog: false
        });
        this.getData(this.state.sid);
      },
      error: data => {
        this.setState({ error: JSON.stringify(data.responseJSON) });
      }
    });
  };

  removeQuestion(qid) {
    $.ajax({
      contentType: "application/json",
      method: "DELETE",
      url: getURL(`question/${qid}/`),
      success: data => {
        this.getData(this.state.sid);
      }
    });
  }

  removeSelection(sid) {
    $.ajax({
      contentType: "application/json",
      method: "DELETE",
      url: getURL(`selection/${sid}/`),
      success: data => {
        this.hideEditSelectionDialog();
        this.getData(this.state.sid);
      }
    });
  }

  getQuestionByID(qid) {
    let questions = this.state.questions;
    for (let question of questions) {
      if (question.id === qid) {
        return question;
      }
    }
    return { title: "" };
  }

  renderSelections(currentQuestionNum) {
    return this.state.questions[currentQuestionNum] !== undefined
      ? this.state.questions[currentQuestionNum].selections.map(selection => {
          return (
            <Fade key={selection.id} in={true}>
             
                <ListItem
                  style={{
                    backgroundColor:
                      this.state.selection_id === selection.id ? "#fdd835" : ""
                  }}
                  onClick={e => {
                    let csid = this.state.selection_id;
                    if (csid === selection.id) {
                      // Cancel the clicked
                      this.hideEditSelectionDialog();
                    } else {
                      this.setState({
                        selection_id: selection.id,
                        selectionName: selection.title,
                        selectionAnchor: e.currentTarget
                      });
                    }
                  }}
                >
                  <Checkbox />
                  <ListItemText>
                    {selection.title}
                    <Tooltip title="Finish" placement="right" open={selection.to_question === null} >
                    <LinkIcon />
                    </Tooltip>
                    {this.getQuestionByID(selection.to_question).title}{" "}
                  </ListItemText>

                  <IconButton
                    onClick={() => {
                      this.removeSelection(selection.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
            </Fade>
          );
        })
      : null;
  }

  renderNavBar() {
    return (
      <AppBar position="static">
        <Toolbar>
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

  renderDialog = () => {
    return (
      <Dialog
        fullWidth
        open={this.state.showAddQuestionDialog}
        onClose={this.handleCloseDialog}
      >
        <DialogTitle>Create New Question</DialogTitle>
        <DialogContent>
          <div style={{ color: "red" }}>{this.state.error}</div>
          <div className="row">
            <TextField
              fullWidth
              value={this.state.questionName}
              onChange={e => {
                this.setState({
                  questionName: e.target.value
                });
              }}
              label="Question Name"
            />
            <TextField
              fullWidth
              value={this.state.questionDescription}
              multiline
              rows={5}
              onChange={e => {
                this.setState({
                  questionDescription: e.target.value
                });
              }}
              label="Question Description"
            />
            <TextField
              fullWidth
              value={this.state.imageSrc}
              onChange={e => {
                this.setState({
                  imageSrc: e.target.value
                });
              }}
              label="Image URL"
            />
          </div>
        </DialogContent>

        <DialogActions>
          <div>
            <Button
              onClick={this.state.edit ? this.editQuestion : this.addQuestion}
            >
              OK
            </Button>
            <Button onClick={this.handleCloseDialog}>Cancel</Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  };

  renderQuestion() {
    return this.state.questions.map((question, index) => {
      return (
        <Grow in={question.id} key={question.id} timeout={500}>
          <Paper
            className="mt-4 col-lg-6 col-md-8 col-sm-10 col-12 mx-auto"
            square={true}
          >
            <div className="d-flex">
              <h4 className="ml-auto mr-auto mt-4 mb-4">
                {question.title}
                <IconButton
                  onClick={() => {
                    this.showAddDialog(true, question.id, index);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    this.removeQuestion(question.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </h4>
            </div>
            <DialogContentText className="pl-4 pr-4">
              {question.description}
            </DialogContentText>
            {question.image && (
              <CardMedia style={{ height: "300px" }} image={question.image} />
            )}
            <List>{this.renderSelections(index)}</List>
            {this.renderSelectionInputField(question.id, index)}
          </Paper>
        </Grow>
      );
    });
  }

  addSelection = (qid, index) => {
    $.ajax({
      contentType: "application/json",
      method: "POST",
      data: JSON.stringify({
        qid: qid,
        title: this.state.selectionNameObj[index]
      }),
      url: getURL("selection/"),
      success: data => {
        this.getData(this.state.sid);
        let selectionObj = this.state.selectionNameObj;
        selectionObj[index] = "";
        this.setState({ selectionNameObj: selectionObj });
      }
    });
  };

  editSelection = sid => {
    console.log(JSON.stringify({
      title: this.state.selectionName,
      to_question: this.state.toQuestionSelect[sid]
    }))
    $.ajax({
      contentType: "application/json",
      method: "PATCH",
      data: JSON.stringify({
        title: this.state.selectionName,
        to_question: this.state.toQuestionSelect[sid]
      }),
      url: getURL(`selection/${sid}/`),
      success: data => {
          this.getData(this.state.sid);
          this.hideEditSelectionDialog();
      }
    });
  };

  renderSelectionInputField(qid, index) {
    return (
      <div className="row mb-4">
        <div className="col-7 ml-4 mb-4">
          <TextField
            fullWidth
            label="Selection"
            value={this.state.selectionNameObj[index]}
            onChange={e => {
              let selectionName = this.state.selectionNameObj;
              selectionName[index] = e.target.value;
              this.setState({
                selectionNameObj: selectionName
              });
            }}
          />
        </div>
        <div className="col-4 mb-4">
          <Fab
            color="primary"
            className="ml-3"
            onClick={() => {
              this.setState({ selectionEditIndex: index });
              this.addSelection(qid, index);
            }}
          >
            <DoneIcon />
          </Fab>
        </div>
      </div>
    );
  }

  renderSelectionEditInput() {
    return (
      <div>
        <TextField
          fullWidth
          label="Selection"
          value={this.state.selectionName}
          onChange={e => {
            this.setState({
              selectionName: e.target.value
            });
          }}
        />
        <DialogActions>
          <div>
            <Button
              onClick={() => {
                this.editSelection(this.state.selection_id);
              }}
            >
              OK
            </Button>
            <Button onClick={this.handleCloseDialog}>Cancel</Button>
          </div>
        </DialogActions>
      </div>
    );
  }

  renderToQuestionSelect() {
    let selectionValue = this.state.toQuestionSelect[this.state.selection_id];
    return (
      <FormControl fullWidth>
        <InputLabel>To Question</InputLabel>
        <Select
          value={selectionValue === undefined ? "" : selectionValue}
          onChange={e => {
            let toQuestion = this.state.toQuestionSelect;
            toQuestion[this.state.selection_id] = e.target.value;
            this.setState({ toQuestionSelect: toQuestion });
          }}
          fullWidth
        >
          {this.state.questions.map((question, index) => {
            return (
              <MenuItem key={`menu-${index}`} value={question.id}>
                {question.title}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {this.renderNavBar()}
        <Fade in={this.state.loading}>
          <LinearProgress color="primary" />
        </Fade>
        <Popper
          open={this.state.selectionAnchor !== ""}
          anchorEl={this.state.selectionAnchor}
          placement="right-start"
          style={{ marginLeft: "20px" }}
          disablePortal={false}
          modifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: "viewport"
            }
          }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Card>
                <CardContent>
                  <h4>Edit Selection</h4>
                  {this.renderToQuestionSelect()}
                  {this.renderSelectionEditInput()}
                </CardContent>
              </Card>
            </Fade>
          )}
        </Popper>
        {this.renderQuestion()}
        {this.renderDialog()}
        <div className="row">
          <IconButton
            className="mx-auto"
            onClick={() => {
              this.showAddDialog(false, 0);
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </MuiThemeProvider>
    );
  }
}
