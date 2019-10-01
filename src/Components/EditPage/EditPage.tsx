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
  Button
} from "@material-ui/core";
import { purple, lightBlue } from "@material-ui/core/colors";
import QuestionDisplay from "./QuestionDisplay";
import { EditContext } from "../models/editState";
import PopupMenu from "./components/PopupMenu";
import FloatButton from "./components/FloatButton";
import TreeView from "./TreeView";

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

export default function EditPage() {
  const classes = useStyles();
  const editContext = useContext(EditContext);
  const { selectedSelectionPosition } = editContext;
  const [openTreeview, setopenTreeview] = useState(false);

  const appbar = () => (
    <AppBar color="primary" elevation={0} className={classes.appbar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          News
        </Typography>
      </Toolbar>
    </AppBar>
  );
  return (
    <MuiThemeProvider theme={theme}>
      {appbar()}
      {selectedSelectionPosition && <PopupMenu></PopupMenu>}
      <QuestionDisplay></QuestionDisplay>
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
