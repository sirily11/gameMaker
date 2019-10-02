import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  createMuiTheme,
  MuiThemeProvider,
  Button,
  IconButton
} from "@material-ui/core";
import { purple, lightBlue } from "@material-ui/core/colors";
import QuestionDisplay from "./QuestionDisplay";
import { EditContext } from "../models/editState";
import PopupMenu from "./components/PopupMenu";
import FloatButton from "./components/FloatButton";
import TreeView from "./TreeView";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { RouterProps } from "react-router";
import { Progress } from "semantic-ui-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflowY: "hidden",
      height: "100%"
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    display: {
      padding: 10
    },
    appbar: {
      top: 0,
      height: 300,
      zIndex: 10
    },
    popup: {
      paddingLeft: 60,
      zIndex: 200
    }
  })
);

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: lightBlue
  }
});

interface Props extends RouteComponentProps<{ id: string }> {}

export default function EditPage(props: Props) {
  const classes = useStyles();
  const editContext = useContext(EditContext);
  const { selectedSelectionPosition, game, fetch } = editContext;
  const [openTreeview, setopenTreeview] = useState(false);
  if (
    !game ||
    (!game.object || game.object.id !== parseInt(props.match.params.id))
  ) {
    fetch(parseInt(props.match.params.id));
  }

  const appbar = () => (
    <AppBar color="primary" elevation={0} className={classes.appbar}>
      <Toolbar>
        <NavLink to="/home">
          <IconButton style={{ color: "white" }}>
            <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
          </IconButton>
        </NavLink>

        <Typography variant="h6" className={classes.title}>
          Edit {game && game.object && game.object.title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
  return (
    <MuiThemeProvider theme={theme}>
      {appbar()}
      {selectedSelectionPosition && <PopupMenu></PopupMenu>}
      {!game && <Progress></Progress>}
      {game && <QuestionDisplay></QuestionDisplay>}

      <FloatButton></FloatButton>
      <Button
        style={{
          zIndex: 1000,
          position: "fixed",
          right: 10,
          top: 10,
          color: "white"
        }}
        onClick={() => setopenTreeview(true)}
      >
        Show Tree
      </Button>
      {openTreeview && (
        <TreeView
          open={openTreeview}
          onClose={() => setopenTreeview(false)}
        ></TreeView>
      )}
    </MuiThemeProvider>
  );
}
